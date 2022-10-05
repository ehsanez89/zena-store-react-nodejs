require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const global = require('../global');
const Boom = require('@hapi/boom');
const njwt = require('njwt');
require('date-update');
const { insertUnconfirmedUser, confirmUser, getLoginUser, getUser } = require('../database/users');
const { insertNewConfirmationToken, deleteToken, getEmailToken } = require('../database/confirmation_token');
const {
    checkEmail,
    checkName,
    checkPassword,
    checkDate,
    checkAddress,
    checkFiscalCode,
} = require('../utils/sanitization.js');
const { verifyUserMiddleware, base64SigningKey } = require('../utils/middleware');
const { validationResult } = require('express-validator');

const loginRouter = express.Router();
function sendConfirmationEmail(email, token) {
    const toPromise = function (resolve, reject) {
        global.transporter.sendMail(
            {
                from: process.env.MAIL_USER,
                to: email,
                subject: 'Confirmation CP registration',
                text: `Hi, click this link to confirm your account: ${
                    // TODO: create an endpoint to handle the confirmation email in the website and use that URL
                    process.env.SERVER_URL
                }/auth/confirmation?token=${encodeURIComponent(token)}`,
            },
            (err, info) => {
                if (err) {
                    console.error('[sendConfirmationEmail] err:', err);
                    reject('SEND_CONFIRMATION_EMAIL');
                }
                console.log('[sendConfirmationEmail] info:', info);
                resolve();
            },
        );
    };

    return new Promise(toPromise);
}

function genConfirmationToken(email) {
    const toPromise = function (resolve, reject) {
        crypto.randomBytes(16, async (err, buf) => {
            if (err) {
                console.error('[genConfirmationToken] randomBytes err:', err);
                reject('GEN_CONFIRMATION_TOKEN');
                return;
            }
            const token = buf.toString('base64');
            try {
                insertNewConfirmationToken(email, token)
                    .then(() => sendConfirmationEmail(email, token))
                    .then(() => resolve())
                    .catch((e) => {
                        reject(e);
                    });
            } catch (e) {
                console.error('[genConfirmationToken] db insert err:', e);
                reject('GEN_CONFIRMATION_TOKEN');
            }
        });
    };

    return new Promise(toPromise);
}

loginRouter.post(
    '/signup',
    [
        checkEmail('email'),
        checkName('name'),
        checkName('surname'),
        checkPassword('password'),
        checkAddress('address'),
        checkFiscalCode('fiscalCode'),
    ],
    function (req, res, next) {
        console.log('SignUp - Request Body Params - ', JSON.stringify(req.body));
        let { address, birthdate, name, surname, password, fiscalCode, email } = req.body;
        if (validationResult(req).isEmpty() && (birthdate = checkDate(req.body.birthdate)) != null) {
            insertUnconfirmedUser(address, birthdate, email, name, password, surname, fiscalCode)
                .then(() => genConfirmationToken(email))
                .then(() =>
                    res.send({
                        status: 'OK',
                    }),
                )
                .then(() => console.log('SignUp - Success - ', email))
                .catch((err) => {
                    console.log('SignUp - Failure - ', email);
                    switch (err) {
                        case 'ER_DUP_ENTRY':
                            next(Boom.badData('User already exists!'));
                            break;
                        case 'SEND_CONFIRMATION_EMAIL':
                            next(Boom.internal('Error during email confermation, contact the support team.'));
                            break;
                        case 'GEN_CONFIRMATION_TOKEN':
                            next(Boom.internal('Error during confermation process, contact the support team.'));
                            break;
                        default:
                            next(Boom.internal('Problem during registration! Please, try again later'));
                    }
                });
        } else {
            console.log('SignUp - Failure', validationResult(req).array());
            next(Boom.badImplementation('Error with the infos provided, contact the support team.'));
        }
    },
);

loginRouter.post('/signin', [checkEmail('email'), checkPassword('password')], function (req, res, next) {
    console.log('SignIn - Request Body Params - ', JSON.stringify(req.body));
    const { email, password } = req.body;
    if (validationResult(req).isEmpty()) {
        getLoginUser(email, password)
            .then((user) => {
                console.log(user);
                const claims = {
                    // TODO: now name and surname is useless, put here the email could be useful in the profile/update endpoint
                    userName: user.name,
                    userSurname: user.surname,
                    userUuid: user.uuid,
                };
                const jwt = njwt.create(claims, base64SigningKey);
                res.cookie('jwt', jwt.compact(), { maxAge: 43200000, httpOnly: true }); // expiration after 12 hours
                res.send({
                    status: 'OK',
                    ...user,
                });
            })
            .then(() => console.log('SignIn - Success - ', email))
            .catch((err) => {
                console.log('SignIn - Failure - ', email, err);
                switch (err) {
                    case '2_USER_LOGIN':
                        next(Boom.badImplementation('Problem during login! Please, contact the support team'));
                        break;
                    case 'WRONG_CREDENTIALS':
                        next(Boom.unauthorized('Wrong email or password! Check them and retry'));
                        break;
                    default:
                        next(Boom.internal('Problem during login! Please, try again later'));
                }
            });
    } else {
        console.log('SignIn - Failure', validationResult(req).array());
        next(Boom.badImplementation('Error with the infos provided, contact the support team.'));
    }
});

loginRouter.get('/confirmation', function (req, res, next) {
    const token = decodeURIComponent(req.query.token);

    getEmailToken(token)
        .then((email) => confirmUser(email))
        .then((email) => deleteToken(email))
        .then(() =>
            res.send({
                status: 'OK',
            }),
        )
        .catch((error) => {
            console.log('Confirmation - Failure', error);
            switch (error) {
                case 'TOKEN_NOT_VALID':
                    next(Boom.unauthorized('Login session expired! Please, login again'));
                    break;
                default:
                    next(Boom.internal('Problem during login! Please, try again later'));
            }
        });
});

loginRouter.get('/verify', verifyUserMiddleware(false), function (token, req, res, next) {
    res.send({
        status: 'OK',
    });
});

loginRouter.get('/resendConfirmationToken', [checkEmail('email')], function (req, res, next) {
    const { email } = req.query;
    if (validationResult(req).isEmpty()) {
        getUser({ email: email, confirmed: 0 })
            .then(() => genConfirmationToken(email))
            .then(() =>
                res.send({
                    status: 'OK',
                }),
            )
            .catch((error) => {
                console.error('[resendToken] genConfirmationToken:', error);
                switch (error) {
                    case 'GEN_CONFIRMATION_TOKEN':
                        next(Boom.internal('Error during resending the token, contact the support team.'));
                        break;
                    default:
                        next(Boom.internal('Problem during login! Please, try again later'));
                }
            });
    } else {
        next(Boom.badImplementation('Error with the infos provided, contact the support team.'));
    }
});

loginRouter.get('/logout', function (req, res, next) {
    res.cookie('jwt', 'deleted', { maxAge: 0, httpOnly: true });
    res.send({
        status: 'OK',
    });
});

exports.loginRouter = loginRouter;
