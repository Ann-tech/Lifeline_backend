const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('../logging/logger')

async function connectToDb() {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });

    mongoose.connection.on('connected', () => {
        logger.info('Database connected successfully');
    });

    mongoose.connection.on('error', (error) => {
        logger.error(error)
    })
}

module.exports = { connectToDb }