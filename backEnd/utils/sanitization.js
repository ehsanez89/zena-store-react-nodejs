const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const { check } = require('express-validator');
const moment = require('moment');
const crypto = require('crypto');

/**
 * express validator for email
 * @param {string|undefined} fieldName
 */
function checkEmail(fieldName) {
    return check(fieldName).trim().isEmail();
}

/**
 * express validator for names
 *
 * constraints:
 * - alphabetical chars
 * - apostrophe
 * - space
 * - max length: 64 chars
 * @param {string|undefined} fieldName
 */
function checkName(fieldName) {
    return check(fieldName)
        .trim()
        .isString()
        .custom((value) => value.length <= 64 && /^[a-zA-Z' ]+$/.test(value));
}

/**
 * express validator for passwords
 *
 * constraints:
 * - at least 8 chars
 * - at least one lowercase letter
 * - at least one uppercase letter
 * - at least a number
 * - at least a special chars (defined as non alphanumeric char)
 * @param {string|undefined} fieldName
 */
function checkPassword(fieldName) {
    return check(fieldName)
        .isLength({ min: 8, max: 100 })
        .custom(
            (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^a-zA-Z0-9]/.test(value),
        );
}

/**
 * express validator for address
 *
 * The address must follow this structure: `address`, `cap`, `city`, `province`
 * @param {string|undefined} fieldName
 */
function checkAddress(fieldName) {
    return check(fieldName)
        .trim()
        .isLength({ max: 100 })
        .custom((value) => /^[a-zA-Z0-9' ]+, [0-9]{5}, [a-zA-Z]+, [A-Z]{2}$/.test(value));
}

/**
 * returns the sanitized input if it is a valid date, otherwise null
 *
 * The date must follow the format: DD/MM/YYYY
 * @param {string|undefined} date
 */
function checkDate(date) {
    // TODO(?) using a timestamp?
    if (!date) return null;
    date = date.trim();
    const format = 'YYYY-MM-DD';
    const parsedDate = moment(date, format).format(format);
    return parsedDate === date ? moment(date, format).toDate() : null;
}

/**
 * returns true if the picture is valid, otherwise false
 *
 * The picture must be square and not larger than 500Kb
 * @param {string|undefined} picture
 * @param {string|undefined} originalName
 */
function checkProfilePicture(picture, originalName) {
    if (
        !picture ||
        !originalName ||
        !fs.existsSync(picture) ||
        !['.png', '.jpg'].includes(path.extname(originalName).toLowerCase())
    )
        return false;
    const size = sizeOf(picture);
    return size.width === size.height && fs.statSync(picture).size <= 500 * 1000; // 500kb
}

/**
 * express validator for fiscal code
 *
 * The fiscal code must follow the format: abcdef12g34h567k
 * @param {string|undefined} cf
 */
function checkFiscalCode(fieldName) {
    return check(fieldName)
        .trim()
        .custom((value) => /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/.test(value))
        .toUpperCase();
}

/* Product Service Card Sanitization */
/**
 * express validator for product's title
 *
 * constraints:
 * - max length: 64 chars
 * @param {string} fieldName
 */
function checkTitle(fieldName) {
    return check(fieldName).trim().isLength({ min: 1, max: 64 }).isString().notEmpty();
}

/**
 * express validator for product's price
 *
 * constraints:
 * - max price 99999
 * - min val 0.5
 *
 * @param {string} fieldName
 */
function checkPrice(fieldName) {
    return check(fieldName).isFloat({ min: 0.5, max: 99999 });
}

/**
 * express validator for product's quantity
 *
 * constraints:
 * - max quantity 99999
 * - min val 1
 *
 * @param {string} fieldName
 */
function checkQuantity(fieldName) {
    return check(fieldName).isInt({ min: 1, max: 99999 });
}

/**
 * express validator for product's description
 *
 * constraints:
 * - max length: 200 chars
 * @param {string} fieldName
 */
function checkDescription(fieldName) {
    return check(fieldName)
        .if((value) => !!value)
        .trim()
        .isLength({ max: 200 });
}

/**
 * express validator for timestamp (seconds since epoch)
 *
 * constraints:
 * - must be more or equal then actual timestamp
 * @param {string} fieldName
 */
function checkTimestamp(fieldName) {
    return check(fieldName)
        .isNumeric()
        .custom((value) => moment.now() <= value);
}

/**
 * returns true if the picture is valid, otherwise false
 *
 * The picture must be square and not larger than 5mb
 * @param {string|undefined} picture
 * @param {string|undefined} originalName
 */
function checkProductPicture(picture, originalName) {
    if (
        !picture ||
        !originalName ||
        !fs.existsSync(picture) ||
        !['.png', '.jpg'].includes(path.extname(originalName).toLowerCase())
    )
        return false;
    return fs.statSync(picture).size <= 5242880; // ~5mb
}

/**
 * express validator uuid
 *
 * @param {string} fieldName
 */
function checkUuid(fieldName) {
    return check(fieldName)
        .trim()
        .custom((value) => /^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/.test(value));
}

/**
 * check image extension is present in accepted ones
 *
 * @param {string} data
 */
function checkFileExtension(data) {
    if (data.includes('png')) return '.png';
    if (data.includes('jpg')) return '.jpg';
    if (data.includes('jpeg')) return '.jpeg';
    return null;
}

function checkImages(fieldName) {
    return (req, res, next) => {
        const images = req.body[fieldName];
        const newImages = [];
        let failed = false;

        if (!images || images.length <= 0) {
            req.body.images = [];
            next();
            return;
        }

        for (let i = 0; i < images.length; ++i) {
            const image = images[i];

            console.log('sizes ', image.length, 6 * 1024 * 1024, image.length > 6 * 1024 * 1024);

            if (image.length > 6 * 1024 * 1024) {
                failed = true;
                break;
            }

            const tmp = image.split('base64,');
            const ext = checkFileExtension(tmp[0]);
            const md5image = crypto.createHash('md5').update(tmp[1]).digest('hex');

            newImages.push({
                md5: md5image,
                ext: ext,
                content: tmp[1],
            });
        }

        req.body[fieldName] = newImages;

        if (failed) {
            res.sendStatus(400);
            return;
        }

        next();
    };
}

function checkImage(fieldName) {
    return (req, res, next) => {
        if (req.body[fieldName]) {
            // this because checkImages accept an array of images
            req.body[fieldName] = [req.body[fieldName]];
            checkImages(fieldName)(req, res, () => {
                req.body[fieldName] = req.body[fieldName][0];
                console.log('checkImage --> ', fieldName, req.body[fieldName]);
                next();
            });
        } else next();
    };
}

exports.checkAddress = checkAddress;
exports.checkDate = checkDate;
exports.checkName = checkName;
exports.checkPassword = checkPassword;
exports.checkEmail = checkEmail;
exports.checkProfilePicture = checkProfilePicture;
exports.checkFiscalCode = checkFiscalCode;
exports.checkTimestamp = checkTimestamp;
exports.checkPrice = checkPrice;
exports.checkQuantity = checkQuantity;
exports.checkTitle = checkTitle;
exports.checkDescription = checkDescription;
exports.checkProductPicture = checkProductPicture;
exports.checkUuid = checkUuid;
exports.checkFileExtension = checkFileExtension;
exports.checkImages = checkImages;
exports.checkImage = checkImage;
