const express = require('express');
const Boom = require('@hapi/boom');
const {
    insertNewProduct,
    selectCategories,
    getProducts,
    insertTransaction,
    getBuyerHistory,
    getSalesHistory,
} = require('../database/products');
const { createFolder, saveBase64ImageToFile } = require('../utils/fs_utils');

const { validationResult } = require('express-validator');
const {
    checkTitle,
    checkPrice,
    checkDescription,
    checkTimestamp,
    checkQuantity,
    checkAddress,
    checkImages,
} = require('../utils/sanitization');
const { verifyUserMiddleware } = require('../utils/middleware');

const productRouter = express.Router();

productRouter.get('/categories', function (req, res, next) {
    console.log('Ask all categories');
    selectCategories()
        .then((categories) => {
            res.send({
                status: 'OK',
                data: categories.map((cat) => ({ id: cat.id, name: cat.name })),
            });
        })
        .catch((e) => {
            switch (e) {
                case 'CATEGORIES_FAILURE':
                    next(Boom.badImplementation('Failed to retrieve categories, please contact the support team!'));
            }
        });
});

productRouter.post(
    '/insert',
    [
        checkTitle('title'),
        checkPrice('price'),
        checkQuantity('quantity'),
        checkTimestamp('start'),
        checkTimestamp('end'),
        checkDescription('description'),
        checkImages('images'),
        verifyUserMiddleware(),
    ],
    async function (token, req, res, next) {
        console.log('Insert new product');
        const { title, price, quantity, start, end, categories, address, description, images } = req.body;
        if (validationResult(req).isEmpty() && start < end && (!address || checkAddress(address))) {
            const cardImage = images.length > 0 ? images[0].md5 + images[0].ext : '';
            insertNewProduct(
                token.body.userUuid,
                title,
                price,
                quantity,
                start,
                end,
                categories,
                address,
                description,
                cardImage,
            )
                .then(async (idProduct) => {
                    createFolder('images/products/', idProduct.toString());
                    const path = 'images/products/' + idProduct.toString() + '/';
                    for (let i = 0; i < images.length; ++i) {
                        saveBase64ImageToFile(path + images[i].md5 + images[i].ext, images[i].content);
                    }
                    res.send({
                        status: 'OK',
                    });
                })
                .catch((e) => {
                    switch (e) {
                        case 'CATEGORY_ERROR':
                            next(Boom.internal('Error adding a new product, try later!'));
                            break;
                        case 'PRODUCT_INSERTION_ERROR':
                            next(Boom.internal('Error adding a new product, try later!'));
                            break;
                        default:
                            next(Boom.internal('Problem during the product insertion! Please, try again later'));
                    }
                    console.error(e);
                    res.statusCode = 500;
                    res.send({
                        status: 'ERROR',
                        error: 'Failed to create the product',
                    });
                });
        } else {
            console.log('Insert new product - Failure', validationResult(req).array());
            next(Boom.badImplementation('Error during product insertion - Please contact the support team!'));
        }
    },
);

productRouter.get('/list', [verifyUserMiddleware(false)], function (token, req, res, next) {
    getProducts()
        .then((result) => {
            res.send(result);
        })
        .catch((e) => {
            console.error(e);
            switch (e) {
                case 'RETRIEVING_PRODUCTS':
                    next(Boom.internal('Failed to retrieve products, try later!'));
            }
        });
});

productRouter.get('/get/:id', [verifyUserMiddleware(false)], function (token, req, res, next) {
    console.log('Asking for the product ' + req.params.id);
    const id = +req.params.id;
    if (!isNaN(id)) {
        getProducts({ 'cards.id': id })
            .then((result) => {
                res.send(result[0]);
            })
            .catch((e) => {
                console.error(e);
                switch (e) {
                    case 'RETRIEVING_PRODUCTS':
                        next(Boom.notFound('Failed to retrieve products, try later!'));
                        break;
                    default:
                        next(Boom.internal('Problem during buying the product! Please, try again later'));
                }
            });
    } else {
        next(Boom.badRequest('Failed to retrieve products, contact the support'));
    }
});

productRouter.post('/buy/:id', [verifyUserMiddleware()], function (token, req, res, next) {
    console.log('Buying product ' + req.params.id);
    const productId = +req.params.id;
    const buyerId = token.body.userUuid;
    if (!isNaN(productId)) {
        insertTransaction(buyerId, productId)
            .then(() => {
                res.send({
                    status: 'OK',
                });
            })
            .catch((e) => {
                console.error(e);
                switch (e) {
                    case 'TRANSACTION_FAILURE':
                        next(Boom.internal('Failed to buy the product'));
                        break;
                    case 'TRANSACTION_NO_PRODUCT':
                        next(Boom.resourceGone('Product not found'));
                        break;
                    case 'TRANSACTION_NO_BALANCE':
                        next(Boom.preconditionFailed('Not enough balance'));
                        break;
                    default:
                        next(Boom.internal('Problem during buying the product! Please, try again later'));
                }
            });
    } else {
        next(Boom.badRequest('Failed to buy the products, contact the support'));
    }
});

exports.productRouter = productRouter;
