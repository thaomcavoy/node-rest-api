const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// Connect to Mongo DB
mongoose.connect('nmongodb+srv://' + 
    process.env.MONGO_ATLAS_USER + ':' + process.env.MONGO_ATLAS_PW + 
    '@node-rest-api-ixvlx.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

app.use(morgan('dev')); // Logger for dev mode
app.use(bodyParser.urlencoded({extended: false})); //set extended to false to parse simple bodies for url encoded data
app.use(bodyParser.json());

// Handling CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next(); //continue to route handling
});

// Routes to handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;