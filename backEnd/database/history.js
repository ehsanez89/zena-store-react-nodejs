const { dbConn } = require('./util');

function getBuyerHistory(uuid) {
    const toPromise = function (resolve, reject) {
        dbConn('transactions')
            .select(
                'transactions.id',
                'transactions.uuid',
                'transactions.buyer_id',
                'transactions.seller_id',
                'transactions.amount',
                'transactions.timestamp',
                'transactions.card_id',
                'u2.name',
                'cards.title',
            )
            .where('users.uuid', uuid)
            .leftOuterJoin('users', 'users.uuid', 'transactions.buyer_id')
            .leftOuterJoin('users as u2', 'u2.uuid', 'transactions.seller_id')
            .leftOuterJoin('cards', 'cards.id', 'transactions.card_id')
            .then((result) => {
                if (result.length > 0) resolve(result);
                else reject('NO_MATCH_UUID_FOUND');
            });
    };
    return new Promise(toPromise);
}

function getSalesHistory(uuid) {
    const toPromise = function (resolve, reject) {
        dbConn('transactions')
            .select(
                'transactions.id',
                'transactions.uuid',
                'transactions.buyer_id',
                'transactions.seller_id',
                'transactions.amount',
                'transactions.timestamp',
                'transactions.card_id',
                'u2.name',
                'cards.title',
            )
            .where('users.uuid', uuid)
            .leftOuterJoin('users', 'users.uuid', 'transactions.seller_id')
            .leftOuterJoin('users as u2', 'u2.uuid', 'transactions.buyer_id')
            .leftOuterJoin('cards', 'cards.id', 'transactions.card_id')
            .then((result) => {
                if (result.length > 0) resolve(result);
                else reject('NO_MATCH_UUID_FOUND');
            });
    };
    return new Promise(toPromise);
}

exports.getBuyerHistory = getBuyerHistory;
exports.getSalesHistory = getSalesHistory;
