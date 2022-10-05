const njwt = require('njwt');
const secureRandom = require('secure-random');
const { dbConn } = require('../database/util');

const base64SigningKey = secureRandom(256, { type: 'Buffer' }).toString('base64');

/**
 * @param {boolean} requireConfirmation if `false` the user can be unconfirmed
 *
 * **NB:** the next function must handle the token in the params of the function (like `function (token, req, res)`),
 * otherwise something strange happen and the server did not respond
 */
function verifyUserMiddleware(requireConfirmation = true) {
    return (req, res, next) => {
        njwt.verify(req.cookies.jwt || '', base64SigningKey, (err, verifiedToken) => {
            if (err) {
                console.error('verifyUserMiddleware - ', err);
                res.sendStatus(401);
            } else {
                if (requireConfirmation) {
                    dbConn('users')
                        .select('confirmed')
                        .where({ uuid: verifiedToken.body.userUuid })
                        .then((r) => {
                            if (r.length === 1 && r[0].confirmed) next(verifiedToken);
                            else res.sendStatus(401);
                        });
                } else {
                    next(verifiedToken);
                }
            }
        });
    };
}

exports.base64SigningKey = base64SigningKey;
exports.verifyUserMiddleware = verifyUserMiddleware;
