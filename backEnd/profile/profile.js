const express = require('express');
const Boom = require('@hapi/boom');

const { verifyUserMiddleware } = require('../utils/middleware');
const {
    getUserProfileByUuid,
    checkPassword,
    updateProfileInfo,
    updateProfileImageName,
    getHashedPassword,
} = require('../database/users');
const { checkImage, checkProfilePicture } = require('../utils/sanitization');
const { createFolder, saveBase64ImageToFile, deleteFolder } = require('../utils/fs_utils');

const profileRouter = express.Router();

const profilePath = 'images/profiles/';

profileRouter.get('/info', [verifyUserMiddleware(false)], function (token, req, res, next) {
    console.log('Get User Profile - Request Body Params - ', JSON.stringify(req.body));
    const uuid = token.body.userUuid;
    getUserProfileByUuid(uuid)
        .then((user) => {
            user.picture =
                process.env.PUBLIC_PATH +
                profilePath +
                '/' +
                (user.picture ? user.uuid + '/' + user.picture : 'default_image.png');
            res.send({
                status: 'OK',
                user: user,
            });
        })
        .then(() => console.log('GetUserProfile - Success - ', uuid))
        .catch((error) => {
            console.log('GetUserProfile - Failure - ', uuid, error);
            switch (error) {
                case 'NO_MATCH_UUID_FOUND':
                    next(Boom.notFound('User non found. Contact the support team!'));
                    break;
                default:
                    next(Boom.internal('Problem during the fetch of the profile! Please, try again later'));
            }
        });
});

profileRouter.get('/balance', [verifyUserMiddleware(false)], function (token, req, res, next) {
    const uuid = token.body.userUuid;
    getUserProfileByUuid(uuid)
        .then((user) => {
            res.send({
                status: 'OK',
                balance: user.balance,
            });
        })
        .then(() => console.log('GetBalance - Success - ', uuid))
        .catch((error) => {
            console.log('GetBalance - Failure - ', uuid, error);
            switch (error) {
                case 'NO_MATCH_UUID_FOUND':
                    next(Boom.notFound('Balance non found. Contact the support team!'));
                    break;
                default:
                    next(Boom.internal('Problem during the fetch of the balance! Please, try again later'));
            }
        });
});

async function updateProfileImage(uuid, image) {
    // TODO: do we have any stronger constraint for the profile picture?
    try {
        const path = profilePath + uuid;
        deleteFolder(path);
        createFolder(profilePath, uuid);
        saveBase64ImageToFile(path + '/' + image.md5 + image.ext, image.content);
        await updateProfileImageName(uuid, image.md5 + image.ext);
    } catch (err) {
        console.error(err);
        throw new Error('UPDATE_PROFILE_IMAGE_FAILED');
    }
}

async function deleteProfileImage(uuid) {
    try {
        deleteFolder(uuid);
        await updateProfileImageName(uuid, null);
    } catch (err) {
        console.log(err);
        throw new Error('DELETE_PROFILE_IMAGE_FAILED');
    }
}

profileRouter.post(
    '/update',
    [checkImage('image'), verifyUserMiddleware(false)],
    async function postUserProfile(token, req, res, next) {
        console.log('Post User Profile - Request Body Params - ', JSON.stringify(req.body));
        const uuid = token.body.userUuid;

        let password;
        try {
            if (req.body.oldPassword && req.body.newPassword) {
                await checkPassword(req.body.email, req.body.oldPassword, uuid);

                // TODOs:
                // - check newPassword constraints
                // - avoid use the email from the body to hash it
                password = getHashedPassword(req.body.newPassword, req.body.email);
            }
            if (req.body.deleteImage) {
                await deleteProfileImage(uuid);
            } else if (req.body.image) {
                await updateProfileImage(uuid, req.body.image);
            }
            if (req.body.address || password || req.body.bio)
                await updateProfileInfo(uuid, req.body.address, password, req.body.bio);
            res.send({ status: 'OK' });
        } catch (err) {
            const e = err.msg || err;
            switch (e) {
                case 'PASSWORD_NOT_CORRECT':
                    next(Boom.unauthorized('Old password not correct, check it and retry!'));
                    break;
                case 'UPDATE_INFOS_FAILED':
                    next(Boom.internal('Error updating the infos, try later!'));
                    break;
                case 'DELETE_PROFILE_IMAGE_FAILED':
                    next(Boom.internal('Error updating the profile image, try later!'));
                    break;
                case 'UPDATE_PROFILE_IMAGE_FAILED':
                    next(Boom.internal('Error updating the profile image, try later!'));
                    break;
                default:
                    console.error(err);
                    next(Boom.internal('Error updating the profile, try later!'));
            }
            console.log(err);
            next(Boom.internal('Error uploading the image, try later!'));
        }
    },
);

exports.profileRouter = profileRouter;
