const { dbConn } = require('./util');
require('date-update');

async function insertNewConfirmationToken(email, token) {
    const toPromise = function (resolve, reject) {
        dbConn('confirmation_token')
            .insert({
                user_email: email,
                token: token,
                expiration: new Date().add('3h').getTime(),
            })
            .then(() => resolve())
            .catch((e) => {
                console.log(e);
                reject(e);
            });
    };

    return new Promise(toPromise);
}

function deleteToken(email) {
    const toPromise = function (resolve, reject) {
        dbConn('confirmation_token')
            .where('user_email', email)
            .del()
            .then(() => resolve())
            .catch((e) => reject(e));
    };

    return new Promise(toPromise);
}

function getEmailToken(token) {
    const toPromise = function (resolve, reject) {
        dbConn
            .select('user_email', 'expiration')
            .from('confirmation_token')
            .where('token', token)
            .then(async (user) => {
                if (user.length === 1) {
                    if (user[0].expiration > new Date().getTime()) {
                        resolve(user[0].user_email);
                    } else {
                        console.log('confirmation_token - Token expired');
                        reject({ msg: 'TOKEN_NOT_VALID' });
                    }
                } else {
                    console.log('confirmation_token - Token not found');
                    reject({ msg: 'TOKEN_NOT_VALID' });
                }
            })
            .catch((e) => reject(e));
    };

    return new Promise(toPromise);
}

function getFirstToken(email) {
    const toPromise = function (resolve, reject) {
        dbConn
            .select('user_email', 'expiration', 'token')
            .from('confirmation_token')
            .where('user_email', email)
            .orderBy('expiration', 'desc')
            .then((user) => {
                if (user.length >= 1) {
                    for (let i = 0; i < user.length; ++i) {
                        if (user[i].expiration > new Date().getTime()) {
                            resolve(user[i].token);
                        }
                    }
                    reject({ msg: 'Token expired' });
                } else {
                    reject({ msg: 'Token not found' });
                }
            })
            .catch((e) => reject(e));
    };

    return new Promise(toPromise);
}

exports.insertNewConfirmationToken = insertNewConfirmationToken;
exports.getEmailToken = getEmailToken;
exports.getFirstToken = getFirstToken;
exports.deleteToken = deleteToken;
