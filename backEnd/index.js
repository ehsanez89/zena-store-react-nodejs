require('dotenv').config();
require('dotenv').config({ path: `./.${process.env.ENV}.env` });

const { loginRouter } = require('./auth/login.js');
const { productRouter } = require('./products/products');
const { profileRouter } = require('./profile/profile');
const { historyRouter } = require('./history/history');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({ origin: process.env.SITE_URL, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/auth', loginRouter, function (req, res, next) {
    res.sendStatus(401);
});
app.use('/products', productRouter, function (req, res, next) {
    res.sendStatus(404);
});
app.use('/profile', profileRouter, function (req, res, next) {
    res.sendStatus(404);
});
app.use('/history', historyRouter, function (req, res, next) {
    res.sendStatus(404);
});

const publicAssetsRouter = express.Router();
publicAssetsRouter.use(express.static('public'));
app.use(publicAssetsRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is now listening on port: ${process.env.PORT}`);
});

app.use((err, req, res, next) => {
    if (err.isBoom) {
        return res.status(err.output.statusCode).json({ status: 'ERROR', error: err.output.payload });
    }
    return res.status(500);
});
exports.server = app;
