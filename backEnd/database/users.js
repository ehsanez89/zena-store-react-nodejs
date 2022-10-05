const crypto = require('crypto');
const { dbConn } = require('./util');
const uuid = require('uuid');
const { Boom } = require('@hapi/boom');

function getHashedPassword(password, email) {
    try {
        return crypto
            .createHash('sha256')
            .update(password + email)
            .digest('hex');
    } catch (err) {
        console.error('GET_HASHED_PASS_FAILED');
        throw new Error('GET_HASHED_PASS_FAILED');
    }
}

// only for tests
function _updateUser(update, where) {
    const toPromise = function (resolve, reject) {
        dbConn('users')
            .update(update)
            .where(where)
            .then((result) => {
                resolve(result[0]);
            })
            .catch(() => {
                reject();
            });
    };
    return new Promise(toPromise);
}

// only for tests
function _insertUser(
    address,
    birthdate,
    email,
    name,
    password,
    surname,
    fiscalCode,
    balance = 0,
    confirmed = false,
    bio = '',
) {
    const toPromise = function (resolve, reject) {
        dbConn('users')
            .insert({
                address: address,
                birthdate: birthdate,
                email: email,
                fiscalCode: fiscalCode,
                name: name,
                password: getHashedPassword(password, email),
                surname: surname,
                uuid: uuid.v4(),
                balance: balance,
                confirmed: !!confirmed,
                bio: bio,
            })
            .then(() => resolve())
            .catch((e) => {
                console.log(e);
                reject(e.code);
            });
    };

    return new Promise(toPromise);
}

async function updateProfileInfo(uuid, address, passwordHashed, bio) {
    try {
        await dbConn('users')
            .update({
                ...(!!address && { address: address }),
                ...(!!bio && { bio: bio }),
                ...(!!passwordHashed && { password: passwordHashed }),
            })
            .where({ uuid: uuid });
    } catch (err) {
        console.error(err);
        throw new Error('UPDATE_INFOS_FAILED');
    }
}
async function updateProfileImageName(uuid, imageName) {
    try {
        await dbConn('users').update({ picture: imageName }).where({
            uuid: uuid,
        });
    } catch (err) {
        console.error(err);
        throw new Error('UPDATE_NAME_IMAGE_DB');
    }
}

async function checkPassword(email, password, uuid) {
    try {
        const res = await dbConn('users')
            .select('id')
            .where({
                email: email,
                password: getHashedPassword(password, email),
                uuid: uuid,
            });
        if (!res.length) {
            console.error('PASSWORD_NOT_CORRECT');
            throw new Error('PASSWORD_NOT_CORRECT');
        }
    } catch (err) {
        console.error(err);
        throw new Error('CHECK_PASSWORD_FAILED');
    }
}

function getLoginUser(email, password) {
    const toPromise = function (resolve, reject) {
        dbConn('users')
            .select('name', 'surname', 'address', 'email', 'birthdate', 'picture', 'confirmed', 'uuid', 'bio')
            .where({
                email: email,
                password: getHashedPassword(password, email),
            })
            .then((result) => {
                if (result.length === 1) resolve(result[0]);
                else if (result.length === 0) {
                    reject('WRONG_CREDENTIALS');
                    console.log('SignIn - User not registered!');
                } else {
                    reject('2_USER_LOGIN');
                    console.log('SignIn - KERNEL PANIC - more than 2 user with same login!!!');
                }
            })
            .catch((e) => {
                console.log(e);
                reject();
            });
    };
    return new Promise(toPromise);
}

function getUser(query) {
    const toPromise = function (resolve, reject) {
        dbConn('users')
            .select('uuid')
            .where(query)
            .then((result) => {
                if (result.length === 1) resolve(result[0]);
                else reject({ msg: 'No unconfirmed user with this email' });
            })
            .catch((e) => reject(e));
    };
    return new Promise(toPromise);
}

function getUserProfileByUuid(uuid) {
    const toPromise = function (resolve, reject) {
        dbConn('users')
            .select(
                'name',
                'surname',
                'address',
                'email',
                'birthdate',
                'picture',
                'confirmed',
                'uuid',
                'balance',
                'fiscalCode',
            )
            .where({ uuid: uuid })
            .then((result) => {
                if (result.length === 1) resolve(result[0]);
                else reject('NO_MATCH_UUID_FOUND');
            });
    };
    return new Promise(toPromise);
}

function insertUnconfirmedUser(address, birthdate, email, name, password, surname, fiscalCode) {
    const toPromise = function (resolve, reject) {
        dbConn('users')
            .insert({
                address: address,
                birthdate: birthdate,
                email: email,
                fiscalCode: fiscalCode,
                name: name,
                password: getHashedPassword(password, email),
                surname: surname,
                uuid: uuid.v4(),
            })
            .then(() => resolve())
            .catch((e) => {
                console.log(e);
                reject(e.code);
            });
    };

    return new Promise(toPromise);
}

function removeUser(cf) {
    if (!cf) cf = '';

    const toPromise = function (resolve, reject) {
        dbConn('users')
            .del()
            .where({ fiscalCode: cf.toUpperCase() })
            .then(() => resolve())
            .catch((e) => {
                console.log(e);
                reject();
            });
    };

    return new Promise(toPromise);
}

function confirmUser(email) {
    if (!email) email = '';

    const toPromise = function (resolve, reject) {
        dbConn('users')
            .update({ confirmed: 1 })
            .where({ email: email })
            .then(() => resolve(email))
            .catch((e) => {
                console.log(e);
                reject({ msg: 'Invalid User' });
            });
    };

    return new Promise(toPromise);
}

async function checkConfirmedUser(query) {
    const res = await dbConn('users').select('confirmed').where(query);
    return res.length === 1 && res[0].confirmed;
}

exports.getUser = getUser;
exports.insertUnconfirmedUser = insertUnconfirmedUser;
exports.removeUser = removeUser;
exports.confirmUser = confirmUser;
exports.getLoginUser = getLoginUser;
exports.checkConfirmedUser = checkConfirmedUser;
exports.getUserProfileByUuid = getUserProfileByUuid;
exports.checkPassword = checkPassword;
exports.updateProfileInfo = updateProfileInfo;
exports.updateProfileImageName = updateProfileImageName;
exports.getHashedPassword = getHashedPassword;

exports._updateUser = _updateUser;
exports._insertUser = _insertUser;
