const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../index.js');
const { should } = chai.should();
const { expect } = require('chai');
const { removeUser, getUser } = require('../database/users');
const { getFirstToken } = require('../database/confirmation_token.js');

chai.use(chaiHttp);

describe('Registration Endpoint', () => {
    describe('Valid data', () => {
        before((done) => {
            removeUser('TESTTT00A00F000M').then(done);
        });
        it('test registration user', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '1900-01-01',
                email: `test-email-registration@mail.com`,
                name: 'myname',
                fiscalCode: 'TESTTT00A00F000M',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('OK');
                    done();
                });
        });
    });

    describe('Invalid data', () => {
        it('Invalid Address - missing province', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere',
                birthdate: '1900-01-01',
                email: `test-email-${Math.round(Math.random() * 1000)}@mail.com`,
                name: 'myname',
                fiscalCode: 'trrvcn93a26f839m',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Address - missing CAP', (done) => {
            const creds = {
                address: 'Where I live, Nowhere, GE',
                birthdate: '1900-01-01',
                email: `test-email-error@mail.com`,
                name: 'myname',
                fiscalCode: 'trrvcn93a26f839m',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Date - invalid format', (done) => {
            const creds = {
                address: 'Where I live, Nowhere, GE',
                birthdate: '01-01-1900',
                email: `test-email-error@mail.com`,
                fiscalCode: 'trrvcn93a26f839m',
                name: 'myname',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Date - without year', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/',
                fiscalCode: 'trrvcn93a26f839m',
                email: `test-email-error@mail.com`,
                name: 'myname',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Email - missing domain', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@`,
                fiscalCode: 'trrvcn93a26f839m',
                name: 'myname',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Email - invalid domain', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@.com`,
                fiscalCode: 'trrvcn93a26f839m',
                name: 'myname',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Email - invalid domain', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@mail`,
                fiscalCode: 'trrvcn93a26f839m',
                name: 'myname',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Name - with numbers', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@mail.com`,
                fiscalCode: 'trrvcn93a26f839m',
                name: 'name1',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Name - with special characters', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@mail.com`,
                fiscalCode: 'trrvcn93a26f839m',
                name: 'name_',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Name - XSS', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@mail.com`,
                fiscalCode: 'trrvcn93a26f839m',
                name: '<body onload=alert(‘something’)>;',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Surname - with special characters', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                fiscalCode: 'trrvcn93a26f839m',
                birthdate: '01/01/1990',
                email: `test-email-error@mail.com`,
                name: 'name',
                password: 'Mypassword00@',
                surname: 'mysurname1',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Surname - with special characters', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                fiscalCode: 'trrvcn93a26f839m',
                email: `test-email-error@mail.com`,
                name: 'name',
                password: 'Mypassword00@',
                surname: '_mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Password - too short password', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@mail.com`,
                name: 'name',
                fiscalCode: 'trrvcn93a26f839m',
                password: 'simple',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Password - no uppercase', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@mail.com`,
                name: 'name',
                fiscalCode: 'trrvcn93a26f839m',
                password: 'mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Password - no lowercase', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@mail.com`,
                fiscalCode: 'trrvcn93a26f839m',
                name: 'name',
                password: 'MYPASSWORD00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Password - no number', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@mail.com`,
                name: 'name',
                fiscalCode: 'trrvcn93a26f839m',
                password: 'Mypassword@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });

        it('Invalid Password - no special characters', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '01/01/1990',
                email: `test-email-error@mail.com`,
                fiscalCode: 'trrvcn93a26f839m',
                name: 'name',
                password: 'Mypassword00',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });
        it('Invalid Fiscal Code ', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '1900-01-01',
                email: `test-email-${Math.round(Math.random() * 1000)}@mail.com`,
                name: 'myname',
                fiscalCode: 'trrvcn9a26f839m',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });
        it('Invalid Fiscal Code - missing fiscal code', (done) => {
            const creds = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '1900-01-01',
                email: `test-email-${Math.round(Math.random() * 1000)}@mail.com`,
                name: 'myname',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(creds)
                .end((_err, res) => {
                    console.log(res.body);
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    res.body.should.have.property('error');
                    res.body.should.have.nested.property('error.message').eql('An internal server error occurred');
                    done();
                });
        });
    });
});

describe('Confirmation Token', () => {
    describe('Valid data', () => {
        before(
            () =>
                new Promise((resolve, reject) => {
                    const creds = {
                        address: 'Where I live, 16111, Nowhere, GE',
                        birthdate: '1900-01-01',
                        email: `cpprojectduemilaventi@gmail.com`,
                        name: 'myname',
                        fiscalCode: 'testtt11a11a111a',
                        password: 'Mypassword00@',
                        surname: 'mysurname',
                    };
                    chai.request(server)
                        .post('/auth/signup')
                        .send(creds)
                        .end((err, res) => {
                            if (err) {
                                reject(new Error('Failed to insert unconfirmed user'));
                            }
                            resolve();
                        });
                }),
        );

        it('test unconfirmed user present', (done) => {
            getUser({ email: 'cpprojectduemilaventi@gmail.com', confirmed: 0 })
                .then(() => done())
                .catch((e) => done(new Error(JSON.stringify(e))));
        });

        it('test resend token', (done) => {
            getFirstToken('cpprojectduemilaventi@gmail.com')
                .then((token1) =>
                    chai
                        .request(server)
                        .get('/auth/resendConfirmationToken')
                        .query({ email: 'cpprojectduemilaventi@gmail.com' })
                        .then((res) => {
                            console.log(res.body);
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status');
                            res.body.should.have.property('status').eql('OK');
                        })
                        .then(() => getFirstToken('cpprojectduemilaventi@gmail.com'))
                        .then((token2) => expect(token1).to.not.be.eql(token2))
                        .then(() => done()),
                )
                .catch((err) => done(err));
        });

        it('test to confirm user', (done) => {
            getFirstToken('cpprojectduemilaventi@gmail.com')
                .then((token) =>
                    chai
                        .request(server)
                        .get('/auth/confirmation')
                        .query({ token: token })
                        .then((res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status');
                            res.body.should.have.property('status').eql('OK');
                            done();
                        })
                        .catch((err) => done(err)),
                )
                .catch((err) => done(err));
        });

        it('test confirmed user present', (done) => {
            getUser({ email: 'cpprojectduemilaventi@gmail.com', confirmed: 1 })
                .then(() => done())
                .catch((e) => done(e));
        });

        it('test user not present', (done) => {
            getUser({ email: 'emailthatnotexists@not.exist', confirmed: 0 })
                .then(() => done(new Error()))
                .catch((_e) => done());
        });

        after(() => removeUser('testtt11a11a111a'));
    });
});
