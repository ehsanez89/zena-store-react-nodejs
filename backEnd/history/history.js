const express = require('express');
const Boom = require('@hapi/boom');
const { getBuyerHistory, getSalesHistory } = require('../database/history');

const { verifyUserMiddleware } = require('../utils/middleware');

const historyRouter = express.Router();

historyRouter.get('/buyer_history', [verifyUserMiddleware(false)], function (token, req, res, next) {
    const uuid = token.body.userUuid;
    console.log('Buyer History - uuid: ', uuid);
    getBuyerHistory(uuid)
        .then((result) => {
            res.send(result);
        })
        .then(() => console.log('GetBuyerHistory - Success - ', uuid))
        .catch((error) => {
            console.log('GetBuyerHistory - Failure - ', uuid, error);
            switch (error) {
                case 'NO_MATCH_UUID_FOUND':
                    next(Boom.notFound("You have any purchase! Let's buy something"));
                    break;
                default:
                    next(Boom.internal('Problem during the fetch of the profile! Please, try again later'));
            }
        });
});

historyRouter.get('/sales_history', [verifyUserMiddleware(false)], function (token, req, res, next) {
    const uuid = token.body.userUuid;
    console.log('Seller History - uuid: ', uuid);
    getSalesHistory(uuid)
        .then((result) => {
            res.send(result);
        })
        .then(() => console.log('GetBuyerHistory - Success - ', uuid))
        .catch((error) => {
            console.log('GetBuyerHistory - Failure - ', uuid, error);
            switch (error) {
                case 'NO_MATCH_UUID_FOUND':
                    next(Boom.notFound("You have any sales! Let's sell something"));
                    break;
                default:
                    next(Boom.internal('Problem during the fetch of the profile! Please, try again later'));
            }
        });
});

exports.historyRouter = historyRouter;
