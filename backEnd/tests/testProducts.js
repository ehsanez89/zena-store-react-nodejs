const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../index.js');
const {
    insertUnconfirmedUser,
    removeUser,
    confirmUser,
    getUser,
    getUserProfileByUuid,
    _updateUser,
    _insertUser,
} = require('../database/users');
const { removeProduct, getProducts } = require('../database/products');
const { expect } = require('chai');

const should = chai.should();
require('date-update');

chai.use(chaiHttp);

let loggedUser;
let jwtToken;

describe('GetCategories endpoint', () => {
    describe('Categories', () => {
        it('Test get all categories', (done) => {
            chai.request(server)
                .get('/products/categories')
                .end((_err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('OK');
                    res.body.should.have.property('data');
                    expect(res.body.data).to.have.length(12);
                    const sportCat = res.body.data.find((cat) => cat.name === 'Sport');
                    expect(sportCat).to.have.property('id', 1);
                    expect(sportCat).to.have.property('name', 'Sport');
                    done();
                });
        });
    });
});

// todo it doesn't work because productRouter.get('/list', verifies the token in the body instead of the head of the get

describe('GetProduct endpoint', () => {
    const insertedProductTest = {
        title: 'test-product get all list',
        price: 42,
        quantity: 42,
        start: new Date().add('1h').getTime(),
        end: new Date().add('2h').getTime(),
        description: 'this is a valid product card',
    };
    before(
        () =>
            new Promise((resolve, reject) => {
                removeUser(`TESTTT11A11A111E`) // repeated code todo refactoring?
                    .then(() =>
                        insertUnconfirmedUser(
                            'Where I live, 16111, Nowhere, GE',
                            '01/01/1900',
                            `test-products-endpoint@mail.com`,
                            'confirmed',
                            'Mypassword00@',
                            'confirmed',
                            'TESTTT11A11A111E',
                        ),
                    )
                    .then(() => confirmUser(`test-products-endpoint@mail.com`))
                    .then(() => {
                        const creds = {
                            email: `test-products-endpoint@mail.com`,
                            password: 'Mypassword00@',
                        };
                        chai.request(server)
                            .post('/auth/signin')
                            .send(creds)
                            .end((err, res) => {
                                if (err) {
                                    reject(new Error('Failed to insert unconfirmed user'));
                                }
                                loggedUser = res.body;
                                const prod = insertedProductTest;
                                prod.token = loggedUser.token;
                                jwtToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
                                chai.request(server)
                                    .post('/products/insert')
                                    .set('Cookie', 'jwt='.concat(jwtToken))
                                    .send(prod)
                                    .end((_err, res) => {
                                        res.should.have.status(200);
                                        resolve();
                                    });
                            });
                    });
            }),
    );
    it('Test get all products', (done) => {
        chai.request(server)
            .get('/products/list')
            .set('Cookie', 'jwt='.concat(jwtToken))
            .end((_err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                expect(res.body).to.have.length.greaterThan(0);
                const prodInserted = res.body.find((prod) => prod.title === insertedProductTest.title);
                expect(prodInserted).to.be.not.equal(undefined);
                expect(prodInserted).to.have.property('title', insertedProductTest.title);
                expect(prodInserted).to.have.property('price', insertedProductTest.price);
                expect(prodInserted).to.have.property('description', insertedProductTest.description);
                expect(prodInserted).to.have.property('quantity', insertedProductTest.quantity);
                done();
            });
    });
    after(() => {
        removeProduct({ title: insertedProductTest.title }).then(() => removeUser('TESTTT11A11A111E')); // repeated code todo refactoring?
    });
});

describe('Insert products endpoint', () => {
    const title = 'test product card';

    before(
        () =>
            new Promise((resolve, reject) => {
                removeUser(`TESTTT11A11A111B`)
                    .then(() =>
                        insertUnconfirmedUser(
                            'Where I live, 16111, Nowhere, GE',
                            '01/01/1900',
                            `test-products@mail.com`,
                            'confirmed',
                            'Mypassword00@',
                            'confirmed',
                            'TESTTT11A11A111B',
                        ),
                    )
                    .then(() => confirmUser(`test-products@mail.com`))
                    .then(() => {
                        const creds = {
                            email: `test-products@mail.com`,
                            password: 'Mypassword00@',
                        };
                        chai.request(server)
                            .post('/auth/signin')
                            .send(creds)
                            .end((err, res) => {
                                if (err) {
                                    reject(new Error('Failed to insert unconfirmed user'));
                                }
                                loggedUser = res.body;
                                jwtToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
                                resolve();
                            });
                    });
            }),
    );
    describe('Insert Product valid card', () => {
        it('Test insert product', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 42,
                    quantity: 42,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is a valid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('OK');
                    done();
                });
        });
        it('Test insert product - minimum quantity', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 42,
                    quantity: 1,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is a valid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('OK');
                    done();
                });
        });
        it('Test insert product - maximum quantity', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 42,
                    quantity: 99999,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is a valid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('OK');
                    done();
                });
        });
    });
    describe('Insert Product invalid data', () => {
        it('Invalid date - start date should be after now', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 42,
                    quantity: 42,
                    start: new Date().add('-1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is an invalid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    done();
                });
        });
        it('Invalid date - start date should be before the end date', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 42,
                    quantity: 42,
                    start: new Date().add('2h').getTime(),
                    end: new Date().add('1h').getTime(),
                    description: 'this is an invalid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    done();
                });
        });
        it('Invalid quantity - quantity should be greater then 0', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 42,
                    quantity: 0,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is an invalid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    done();
                });
        });
        it('Invalid quantity - quantity should be positive', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 42,
                    quantity: -1,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is an invalid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    done();
                });
        });
        it('Invalid quantity - quantity should be less then 100000', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 42,
                    quantity: 100000,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is an invalid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    done();
                });
        });

        it('Invalid price - price should be greater then 0.5', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 0.4,
                    quantity: 42,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is an invalid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    done();
                });
        });
        it('Invalid price - price should be less then 99999.1', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: title,
                    price: 99999.1,
                    quantity: 42,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is an invalid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    done();
                });
        });

        it('Invalid price - title must not contains only white spaces', (done) => {
            chai.request(server)
                .post('/products/insert')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send({
                    token: jwtToken,
                    title: '    \n  ',
                    price: 99999,
                    quantity: 42,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is an invalid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('ERROR');
                    done();
                });
        });

        const product = {
            title: title,
            // picture: picture,
            price: 42,
            quantity: 42,
            start: new Date().add('1h').getTime(),
            end: new Date().add('2h').getTime(),
        };

        for (const [key, value] of Object.entries(product)) {
            it(`Invalid fields (undefined) - ${key}`, (done) => {
                const clone = JSON.parse(JSON.stringify(product));
                clone.token = jwtToken;
                clone[key] = undefined;
                chai.request(server)
                    .post('/products/insert')
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .send(clone)
                    .end((_err, res) => {
                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql('ERROR');
                    });
                done();
            });
        }
    });

    describe('Insert Product invalid user', () => {
        let notConfirmedUser;
        before(
            () =>
                new Promise((resolve, reject) => {
                    removeUser(`testtt11a11a111c`)
                        .then(() =>
                            insertUnconfirmedUser(
                                'Where I live, 16111, Nowhere, GE',
                                '01/01/1900',
                                `test-products-not-confirmed@mail.com`,
                                'not-confirmed',
                                'Mypassword00@',
                                'not-confirmed',
                                'testtt11a11a111c',
                            ),
                        )
                        .then(() => {
                            const creds = {
                                email: `test-products-not-confirmed@mail.com`,
                                password: 'Mypassword00@',
                            };
                            chai.request(server)
                                .post('/auth/signin')
                                .send(creds)
                                .end((err, res) => {
                                    if (err) {
                                        reject(new Error('Failed to insert unconfirmed user'));
                                    }
                                    notConfirmedUser = res.body;
                                    resolve();
                                });
                        });
                }),
        );
        it('User not confirmed', (done) => {
            chai.request(server)
                .post('/products/insert')
                .send({
                    token: notConfirmedUser.token,
                    title: title,
                    price: 42,
                    quantity: 42,
                    start: new Date().add('1h').getTime(),
                    end: new Date().add('2h').getTime(),
                    description: 'this is an invalid product card',
                })
                .end((_err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('No login Token Tampered', (done) => {
            const product = {
                title: title,
                price: 42,
                quantity: 42,
                start: new Date().add('1h').getTime(),
                end: new Date().add('2h').getTime(),
                description: 'descrizione molto',
            };
            chai.request(server)
                .post('/products/insert')
                .set(
                    'Cookie',
                    'jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6IkRvTm90IiwidXNlclN1cm5hbWUiOiJEZWxldGUiLCJ1c2VyVXVpZCI6IjQ3MWE0Y2ZlLWRhOWItNGJmNy05NmQxLThkMjc4NmI3YjBlMCIsImp0aSI6IjBjOWMyODNkLWY0ZTAtNDc0Ny1hM2YxLWI4M2Q5YmY4ZTkxOCIsImlhdCI6MTYxMDY1OTU1NSwiZXhwIjoxNjEwNjYzMTU1fQ.W8qagV2w3_iYAl6XTprLt3RjpJh5g7nHehuiB2S22TY',
                )
                .send(product)
                .end((_err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        after(() => {
            removeUser('testtt11a11a111c');
        });
    });
    // TODO:
    // - security checks on describe and title

    after(() => {
        removeProduct({ title: title }).then(() => removeUser('TESTTT11A11A111B'));
    });
});

describe('Get product by id', () => {
    const insertedProductTest = {
        title: 'test-product get all list e59a2641',
        price: 42,
        quantity: 42,
        start: new Date().add('1h').getTime(),
        end: new Date().add('2h').getTime(),
        description: 'this is a valid product card',
    };
    let jwtToken;
    let id;

    before((done) => {
        removeUser(`TESTTT11A11A111E`) // repeated code todo refactoring?
            .then(() =>
                insertUnconfirmedUser(
                    'Where I live, 16111, Nowhere, GE',
                    '01/01/1900',
                    `test-products-endpoint@mail.com`,
                    'confirmed',
                    'Mypassword00@',
                    'confirmed',
                    'TESTTT11A11A111E',
                ),
            )
            .then(() => {
                const creds = {
                    email: `test-products-endpoint@mail.com`,
                    password: 'Mypassword00@',
                };
                chai.request(server)
                    .post('/auth/signin')
                    .send(creds)
                    .then((res, err) => {
                        if (err) {
                            throw new Error('Failed to insert unconfirmed user');
                        }
                        loggedUser = res.body;
                        jwtToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
                    })
                    .then(() => confirmUser(creds.email))
                    .then(() => {
                        chai.request(server)
                            .post('/products/insert')
                            .set('Cookie', 'jwt='.concat(jwtToken))
                            .send(insertedProductTest)
                            .then(() => {
                                chai.request(server)
                                    .get('/products/list')
                                    .set('Cookie', 'jwt='.concat(jwtToken))
                                    .send()
                                    .then((res, err) => {
                                        if (err) {
                                            throw new Error('Failed to get product list');
                                        }
                                        id = res.body.find((p) => p.title === insertedProductTest.title).id;
                                        done();
                                    });
                            });
                    });
            });
    });
    it('Get from a not logged user', (done) => {
        chai.request(server)
            .get('/products/get/' + id)
            .send()
            .then((res, _err) => {
                res.should.have.status(401);
                done();
            })
            .catch((e) => console.log(e));
    });
    it('Get from a logged user', (done) => {
        chai.request(server)
            .get('/products/get/' + id)
            .set('Cookie', 'jwt='.concat(jwtToken))
            .send()
            .then((res, _err) => {
                res.should.have.status(200);
                res.body.title.should.be.eql(insertedProductTest.title);
                done();
            })
            .catch((e) => console.log(e));
    });
    it('Bad request', (done) => {
        chai.request(server)
            .get('/products/get/ajeje')
            .set('Cookie', 'jwt='.concat(jwtToken))
            .send()
            .then((res, _err) => {
                res.should.have.status(400);
                done();
            })
            .catch((e) => console.log(e));
    });
    after(() => {
        removeProduct({ title: insertedProductTest.title }).then(() => removeUser('TESTTT11A11A111B'));
    });
});

describe('Buy product by id', () => {
    const insertedProductTest = {
        title: 'test-product e59a2641',
        price: 42,
        quantity: 1,
        start: new Date().add('1h').getTime(),
        end: new Date().add('2h').getTime(),
    };
    const insertedProductTestExpensive = {
        title: 'test-product a42a2641',
        price: 9999,
        quantity: 1,
        start: new Date().add('1h').getTime(),
        end: new Date().add('2h').getTime(),
    };
    let jwtToken, jwtToken2;
    let id, idExpensive;

    async function getQuantity(id) {
        try {
            return (await getProducts({ 'cards.id': id }))[0].quantity;
        } catch {
            return 0;
        }
    }
    async function getBalance(email) {
        try {
            return (await getUserProfileByUuid((await getUser({ email: email })).uuid)).balance;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    before((done) => {
        removeUser(`TESTTT11A11A111E`) // repeated code todo refactoring?
            .then(() => removeUser(`TESTTT71A11A111F`))
            .then(() =>
                _insertUser(
                    'Where I live, 16111, Nowhere, GE',
                    '01/01/1900',
                    `test-products-endpoint@mail.com`,
                    'confirmed1',
                    'Mypassword00@',
                    'confirmed1',
                    'TESTTT11A11A111E',
                    200,
                    true,
                ),
            )
            .then(() =>
                _insertUser(
                    'Where I live, 16111, Nowhere, GE',
                    '01/01/1900',
                    `test-products-endpoint2@mail.com`,
                    'confirmed2',
                    'Mypassword00@',
                    'confirmed2',
                    'TESTTT71A11A111F',
                    200,
                    true,
                ),
            )
            .then(() =>
                chai.request(server).post('/auth/signin').send({
                    email: `test-products-endpoint@mail.com`,
                    password: 'Mypassword00@',
                }),
            )
            .then((res, err) => {
                if (err) {
                    throw new Error('Failed to insert unconfirmed user');
                }
                loggedUser = res.body;
                jwtToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
            })
            .then(() =>
                chai.request(server).post('/auth/signin').send({
                    email: `test-products-endpoint2@mail.com`,
                    password: 'Mypassword00@',
                }),
            )
            .then((res, err) => {
                if (err) {
                    throw new Error('Failed to insert unconfirmed user');
                }
                loggedUser = res.body;
                jwtToken2 = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
            })
            .then(() =>
                chai
                    .request(server)
                    .post('/products/insert')
                    .set('Cookie', 'jwt='.concat(jwtToken2))
                    .send(insertedProductTest),
            )
            .then(() =>
                chai
                    .request(server)
                    .post('/products/insert')
                    .set('Cookie', 'jwt='.concat(jwtToken2))
                    .send(insertedProductTestExpensive),
            )
            .then(() =>
                chai
                    .request(server)
                    .get('/products/list')
                    .set('Cookie', 'jwt='.concat(jwtToken))
                    .send()
                    .then((res, err) => {
                        if (err) {
                            throw new Error('Failed to get product list');
                        }
                        id = res.body.find((p) => p.title === insertedProductTest.title).id;
                        idExpensive = res.body.find((p) => p.title === insertedProductTestExpensive.title).id;
                        done();
                    }),
            );
    });

    it('not logged buyer', (done) => {
        chai.request(server)
            .post('/products/buy/' + id)
            .send()
            .then((res) => {
                res.should.have.status(401);
                done();
            })
            .catch((e) => console.log(e));
    });
    it('bad request', (done) => {
        getBalance('test-products-endpoint@mail.com').then((balance) => {
            chai.request(server)
                .post('/products/buy/not_a_number')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send()
                .then(async (res) => {
                    res.should.have.status(400);
                    expect(await getBalance('test-products-endpoint@mail.com')).eql(balance);
                    done();
                })
                .catch((e) => console.log(e));
        });
    });
    it('preconditionFailed (no balance)', (done) => {
        getBalance('test-products-endpoint@mail.com').then((balance) => {
            chai.request(server)
                .post('/products/buy/' + idExpensive)
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send()
                .then(async (res) => {
                    res.should.have.status(412);
                    expect(await getBalance('test-products-endpoint@mail.com')).eql(balance);
                    expect(await getQuantity(idExpensive)).eql(1);
                    done();
                })
                .catch((e) => console.log(e));
        });
    });
    it('Correctly buy product', (done) => {
        getBalance('test-products-endpoint@mail.com').then((balance) => {
            chai.request(server)
                .post('/products/buy/' + id)
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send()
                .then(async (res) => {
                    res.should.have.status(200);
                    expect(await getBalance('test-products-endpoint@mail.com')).eql(balance - 42);
                    expect(await getQuantity(id)).eql(0);

                    done();
                })
                .catch((e) => {
                    console.log(e);
                    done(e);
                });
        });
    });
    it('resourceGone (no product)', (done) => {
        getBalance('test-products-endpoint@mail.com').then((balance) => {
            chai.request(server)
                .post('/products/buy/' + id)
                .set('Cookie', 'jwt='.concat(jwtToken))
                .send()
                .then(async (res) => {
                    res.should.have.status(410);
                    expect(await getBalance('test-products-endpoint@mail.com')).eql(balance);
                    done();
                })
                .catch((e) => console.log(e));
        });
    });

    describe('Transactions tests', () => {
        it('buyer_history not logged in error', (done) => {
            chai.request(server)
                .get('/history/buyer_history')
                .end((_err, res) => {
                    if (_err) done(_err);
                    res.should.have.status(401);
                    done();
                });
        });
        it('sales_history not logged in error', (done) => {
            chai.request(server)
                .get('/history/sales_history')
                .end((_err, res) => {
                    if (_err) done(_err);
                    res.should.have.status(401);
                    done();
                });
        });
        it('check buyer_history', (done) => {
            chai.request(server)
                .get('/history/buyer_history')
                .set('Cookie', 'jwt='.concat(jwtToken))
                .end((_err, res) => {
                    if (_err) done(_err);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.be.a('object');
                    res.body[0].should.have.property('name').eql('confirmed2');
                    res.body[0].should.have.property('card_id').eql(id);
                    res.body[0].should.have.property('amount').eql(insertedProductTest.price);
                    res.body[0].should.have.property('title').eql(insertedProductTest.title);
                    done();
                });
        });
        it('check sales_history', (done) => {
            chai.request(server)
                .get('/history/sales_history')
                .set('Cookie', 'jwt='.concat(jwtToken2))
                .end((_err, res) => {
                    if (_err) done(_err);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.be.a('object');
                    res.body[0].should.have.property('name').eql('confirmed1');
                    res.body[0].should.have.property('card_id').eql(id);
                    res.body[0].should.have.property('amount').eql(insertedProductTest.price);
                    res.body[0].should.have.property('title').eql(insertedProductTest.title);
                    done();
                });
        });
    });

    after(() => {
        removeProduct({ title: insertedProductTest.title })
            .then(() => removeProduct({ title: insertedProductTestExpensive.title }))
            .then(() => removeUser('TESTTT11A11A111B'));
    });
});
