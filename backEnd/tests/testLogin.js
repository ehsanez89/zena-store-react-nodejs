const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../index.js');
const { removeUser } = require('../database/users');
const { expect } = require('chai');
const should = chai.should();

chai.use(chaiHttp);

const badDataError = 'An internal server error occurred';
const invalidLoginError = 'Wrong email or password! Check them and retry';

describe('Login Endpoint', () => {
    describe('Valid data', () => {
        before(() => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1900',
                email: `test-email@mail.com`,
                name: 'myname',
                fiscalCode: 'testtt11a11a111a',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server).post('/auth/signup').send(creds);
        });

        it('test login user', (done) => {
            const creds = {
                email: `test-email@mail.com`,
                password: 'Mypassword00@',
            };
            chai.request(server)
                .post('/auth/signin')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message').eql(invalidLoginError);
                    done();
                });
        });

        after(() => {
            removeUser('testtt11a11a111a').then();
        });
    });

    describe('Invalid data', () => {
        it('Invalid Email - missing @', (done) => {
            const creds = {
                email: `test-emailmail.com`,
                password: 'Mypassword00@',
            };
            chai.request(server)
                .post('/auth/signin')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message').eql(badDataError);
                    done();
                });
        });

        it('Invalid Email - missing domain', (done) => {
            const creds = {
                email: `test-email@`,
                password: 'Mypassword00@',
            };
            chai.request(server)
                .post('/auth/signin')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message').eql(badDataError);
                    done();
                });
        });

        it('Invalid Email - missing local-part', (done) => {
            const creds = {
                email: `@mail.com`,
                password: 'Mypassword00@',
            };
            chai.request(server)
                .post('/auth/signin')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message').eql(badDataError);
                    done();
                });
        });

        it('Invalid Password - missing lowarecase character', (done) => {
            const creds = {
                email: `test-email@mail.com`,
                password: 'MYPASSWORD00@',
            };
            chai.request(server)
                .post('/auth/signin')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message').eql(badDataError);
                    done();
                });
        });

        it('Injection', (done) => {
            const creds = {
                email: `bello@figo.gu`,
                password: "Maga2020!' or 1=1 -- ",
            };
            chai.request(server)
                .post('/auth/signin')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql(invalidLoginError);
                    done();
                });
        });

        it('Invalid Passoword - missing uppercase character', (done) => {
            const creds = {
                email: `test-email@mail.com`,
                password: 'mypassword00@',
            };
            chai.request(server)
                .post('/auth/signin')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message').eql(badDataError);
                    done();
                });
        });

        it('Invalid Passoword - missing special character', (done) => {
            const creds = {
                email: `test-email@mail.com`,
                password: 'Mypassword00',
            };
            chai.request(server)
                .post('/auth/signin')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message').eql(badDataError);
                    done();
                });
        });
    });

    describe('Invalid Login', () => {
        it('test failure login user', (done) => {
            const creds = {
                email: `test-email@mail.com`,
                password: `Mypassword00@-${Math.floor(Math.random() * 1000)}`,
            };
            chai.request(server)
                .post('/auth/signin')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message').eql(invalidLoginError);
                    done();
                });
        });
    });
});
