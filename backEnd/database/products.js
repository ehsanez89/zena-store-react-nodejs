/* eslint-disable prefer-promise-reject-errors */
const { dbConn } = require('./util');
const uuid = require('uuid');
const { convertCompilerOptionsFromJson } = require('typescript');

function selectCategories() {
    return new Promise(function (resolve, reject) {
        dbConn
            .select('id', 'name')
            .from('categories')
            .orderBy('id')
            .then((categories) => resolve(categories))
            .catch((e) => reject('CATEGORIES_FAILURE'));
    });
}

function insertNewProduct(seller, title, price, quantity, start, end, categories, address, description, picture) {
    return new Promise(function (resolve, reject) {
        dbConn('cards')
            .insert({
                title: title,
                uid_seller_name: seller,
                // picture: picture,
                price: price,
                quantity: quantity,
                start: dbConn.raw(`FROM_UNIXTIME(${start * 0.001})`),
                end: dbConn.raw(`FROM_UNIXTIME(${end * 0.001})`),
                address: address,
                description: description,
                picture: picture,
            })
            .then((row) => {
                if (categories && categories.length > 0)
                    dbConn('connection_card_category')
                        .insert(categories.map((cat) => ({ id_cards: row[0], id_category: cat })))
                        .then(() => resolve(row[0]))
                        .catch((e) => {
                            console.error(e);
                            dbConn('cards').where({ id: row[0] }).del();
                            reject('CATEGORY_ERROR');
                        });
                else resolve(row[0]);
            })
            .catch((e) => {
                console.error(e);
                reject('PRODUCT_INSERTION_ERROR');
            });
    });
}

function removeProduct(whereCondition) {
    return new Promise(function (resolve, reject) {
        dbConn('cards')
            .del()
            .where(whereCondition)
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

function getProducts(whereCondition = {}) {
    if (!whereCondition) {
        whereCondition = {};
        whereCondition.deleted = false;
    } else if (!('deleted' in whereCondition)) {
        whereCondition.deleted = false;
    }

    return new Promise((resolve, reject) => {
        dbConn('cards')
            .select(
                'cards.*',
                'users.name as seller_name',
                'users.surname as seller_surname',
                dbConn.raw('GROUP_CONCAT(categories.name ORDER BY categories.id) as categories'),
            )
            .where(whereCondition)
            .where('quantity', '>', 0)
            .whereNotNull('cards.uid_seller_name')
            .leftOuterJoin('users', 'cards.uid_seller_name', 'users.uuid')
            .leftOuterJoin('connection_card_category', 'cards.id', 'connection_card_category.id_cards')
            .leftOuterJoin('categories', 'categories.id', 'connection_card_category.id_category')
            .groupBy('cards.id')
            .then((result) => resolve(result))
            .catch((e) => {
                console.error(e);
                reject('RETRIEVING_PRODUCTS');
            });
    });
}

// check on balances and transaction should be done
function insertTransaction(buyerId, productId) {
    const toPromise = function (resolve, reject) {
        let uidSellerName;
        let price;
        let error = 'TRANSACTION_FAILURE';
        dbConn
            .transaction((t) => {
                return dbConn('cards')
                    .select('uid_seller_name', 'price')
                    .where({ id: productId, Deleted: false })
                    .where('quantity', '>', 0)
                    .then((result) => {
                        if (result.length < 1) throw new Error('TRANSACTION_NO_PRODUCT');
                        uidSellerName = result[0].uid_seller_name;
                        price = result[0].price;
                    })
                    .then(() =>
                        dbConn('users')
                            .select('id')
                            .where({ uuid: buyerId })
                            .where('balance', '>=', price)
                            .then((result) => {
                                if (result.length < 1) throw new Error('TRANSACTION_NO_BALANCE');
                            }),
                    )
                    .then(() => dbConn('cards').decrement('quantity', 1).where({ id: productId }))
                    .then(() => dbConn('users').decrement('balance', price).where('uuid', buyerId))
                    .then(() => dbConn('users').increment('balance', price).where('uuid', uidSellerName))
                    .then(() =>
                        dbConn('transactions').insert({
                            uuid: uuid.v4(),
                            buyer_id: buyerId,
                            seller_id: uidSellerName,
                            card_id: productId,
                            amount: price,
                        }),
                    )
                    .then(t.commit)
                    .catch((e) => {
                        error = e.message;
                        t.rollback();
                    });
            })
            .then((result) => resolve(result))
            .catch((e) => {
                console.error('transaction error:', e);
                reject(error);
            });
    };
    return new Promise(toPromise);
}

exports.selectCategories = selectCategories;
exports.insertNewProduct = insertNewProduct;
exports.removeProduct = removeProduct;
exports.getProducts = getProducts;
exports.insertTransaction = insertTransaction;
