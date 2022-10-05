const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../index.js');
const { removeUser, getLoginUser } = require('../database/users');
const { Result } = require('express-validator');

chai.use(chaiHttp);

let jwtToken;
let userInfo;

describe('Profile endpoint', () => {
    before((done) => {
        removeUser('TESTTT00A00F000M').then(() => {
            userInfo = {
                address: 'Where I live, 16111, Nowhere, GE',
                birthdate: '1900-01-01',
                email: `test-profile-endpoint@mail.com`,
                name: 'myname',
                fiscalCode: 'TESTTT00A00F000M',
                password: 'Mypassword00@',
                surname: 'mysurname',
            };
            chai.request(server)
                .post('/auth/signup')
                .send(userInfo)
                .end((_err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .post('/auth/signin')
                        .send({ email: userInfo.email, password: userInfo.password })
                        .end((err, res) => {
                            if (err) {
                                console.log(err);
                            }
                            jwtToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
                            done();
                        });
                });
        });
    });

    describe('Check get Profile', () => {
        it('Refuse if not logged', (done) => {
            chai.request(server)
                .get('/profile/info')
                .end((_err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    done();
                });
        });
        it('Valid request', (done) => {
            chai.request(server)
                .get('/profile/info')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .end((_err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.user.name.should.be.equal(userInfo.name);
                    res.body.user.email.should.be.equal(userInfo.email);
                    res.body.user.address.should.be.equal(userInfo.address);
                    done();
                });
        });
    });
    describe('Check update Profile', () => {
        before((done) => {
            userInfo.address = 'Where I live, 16111, Nowhere, GE';
            userInfo.oldPassword = userInfo.password;
            userInfo.newPassword = 'UpdatedPass2021!';
            userInfo.bio = 'My beautiful bio!';
            done();
        });
        it('Refuse if not logged', (done) => {
            chai.request(server)
                .post('/profile/update')
                .end((_err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        describe('Check update Profile', () => {
            const userInfoUpdated = {
                address: 'Where I live, 16111, Nowhere, GE',
                email: `test-profile-endpoint@mail.com`,
                oldPassword: 'Mypassword00@',
                newPassword: 'Mypassword00!',
            };
            it('Refuse update Profile if not logged', (done) => {
                chai.request(server)
                    .post('/profile/update')
                    .send(userInfoUpdated)
                    .end((_err, res) => {
                        res.should.have.status(401);
                        res.body.should.be.an('object');
                        done();
                    });
            });

            it('Wrong password', (done) => {
                const userInfoUpdated = {
                    email: `test-profile-endpoint@mail.com`,
                    oldPassword: 'Mypassword00!',
                    newPassword: 'Mypassword00!',
                };
                delete userInfoUpdated.address;
                chai.request(server)
                    .post('/profile/update')
                    .send(userInfoUpdated)
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .end((_err, res) => {
                        res.should.have.status(500);
                        done();
                    });
            });

            it('Valid request - update address', (done) => {
                const userInfoUpdated = {
                    address: 'Only address, 16111, Nowhere, GE',
                    email: `test-profile-endpoint@mail.com`,
                };
                chai.request(server)
                    .post('/profile/update')
                    .send(userInfoUpdated)
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .end((_err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.status.should.be.equal('OK');

                        getLoginUser(userInfoUpdated.email, 'Mypassword00@')
                            .then((result) => {
                                if (result.address === userInfoUpdated.address) done();
                                else done(new Error('Failed updating only address'));
                            })
                            .catch((e) => done(e));
                    });
            });

            it('Valid request - update password', (done) => {
                const userInfoUpdated = {
                    email: `test-profile-endpoint@mail.com`,
                    oldPassword: 'Mypassword00@',
                    newPassword: 'Mypassword00!',
                };
                delete userInfoUpdated.address;
                chai.request(server)
                    .post('/profile/update')
                    .send(userInfoUpdated)
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .end((_err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.status.should.be.equal('OK');

                        getLoginUser(userInfoUpdated.email, userInfoUpdated.newPassword)
                            .then((_result) => done())
                            .catch((e) => done(e));
                    });
            });

            it('Valid request - update both password and address', (done) => {
                const userInfoUpdated = {
                    address: 'Both address, 16111, Nowhere, GE',
                    email: `test-profile-endpoint@mail.com`,
                    oldPassword: 'Mypassword00!',
                    newPassword: 'Mypassword00@',
                };
                chai.request(server)
                    .post('/profile/update')
                    .send(userInfoUpdated)
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .end((_err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.status.should.be.equal('OK');

                        getLoginUser(userInfoUpdated.email, userInfoUpdated.newPassword)
                            .then((result) => {
                                if (result.address === userInfoUpdated.address) done();
                                else done(new Error('Failed updating both password and address'));
                            })
                            .catch((e) => done(e));
                    });
            });

            it('Valid request - update bio', (done) => {
                const userInfoUpdated = {
                    bio: 'new updated bio',
                    email: `test-profile-endpoint@mail.com`,
                };
                chai.request(server)
                    .post('/profile/update')
                    .send(userInfoUpdated)
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .end((_err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.status.should.be.equal('OK');

                        getLoginUser(userInfoUpdated.email, 'Mypassword00@')
                            .then((result) => {
                                if (result.bio === userInfoUpdated.bio) done();
                                else done(new Error('Failed updating only address'));
                            })
                            .catch((e) => done(e));
                    });
            });

            it('Valid request - update profile image', (done) => {
                const userInfoUpdated = {
                    image:
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2OY8JXnPwAGOwKRhYxw+QAAAABJRU5ErkJggg==',
                    email: `test-profile-endpoint@mail.com`,
                };
                chai.request(server)
                    .post('/profile/update')
                    .send(userInfoUpdated)
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .end((_err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.status.should.be.equal('OK');

                        getLoginUser(userInfoUpdated.email, 'Mypassword00@')
                            .then((result) => {
                                if (result.picture === 'acfd084b7aefec5dec0b9c81121e9d11.png') done();
                                else done(new Error('Failed updating the image'));
                            })
                            .catch((e) => done(e));
                    });
            });

            it('Valid request - deleteImage update', (done) => {
                const userInfoUpdated = {
                    deleteImage: true,
                    email: `test-profile-endpoint@mail.com`,
                };
                chai.request(server)
                    .post('/profile/update')
                    .send(userInfoUpdated)
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .end((_err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.status.should.be.equal('OK');

                        getLoginUser(userInfoUpdated.email, 'Mypassword00@')
                            .then((result) => {
                                if (result.picture === null) done();
                                else done(new Error('Failed deleting image'));
                            })
                            .catch((e) => done(e));
                    });
            });
        });
    });
});

describe("Profile's balance endpoint", () => {
    describe('Check Data', () => {
        before((done) => {
            removeUser('TESTTT00A00F000M').then(() => {
                userInfo = {
                    address: 'Where I live, 16111, Nowhere, GE',
                    birthdate: '1900-01-01',
                    email: `test-profile-endpoint@mail.com`,
                    name: 'myname',
                    fiscalCode: 'TESTTT00A00F000M',
                    password: 'Mypassword00@',
                    surname: 'mysurname',
                };
                chai.request(server)
                    .post('/auth/signup')
                    .send(userInfo)
                    .end((_err, res) => {
                        res.should.have.status(200);
                        chai.request(server)
                            .post('/auth/signin')
                            .send({ email: userInfo.email, password: userInfo.password })
                            .end((err, res) => {
                                if (err) {
                                    console.log(err);
                                }
                                jwtToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
                                done();
                            });
                    });
            });
        });

        describe('Check get Balance', () => {
            it('Refuse if not logged', (done) => {
                chai.request(server)
                    .get('/profile/balance')
                    .end((_err, res) => {
                        res.should.have.status(401);
                        res.body.should.be.an('object');
                        done();
                    });
            });
            it('Valid request', (done) => {
                chai.request(server)
                    .get('/profile/balance')
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .end((_err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('balance').eql(0);
                        done();
                    });
            });
        });
    });
});
