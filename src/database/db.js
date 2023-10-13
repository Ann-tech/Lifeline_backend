const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('../logging/logger');
const { seedTornadoPrompts } = require('./seeds/tornadoPrompt');

async function connectToDb() {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });

    mongoose.connection.on('connected', async () => {
        logger.info('Database connected successfully');
        await seedTornadoPrompts();
    });

    mongoose.connection.on('error', (error) => {
        logger.error(error)
    })
}

module.exports = { connectToDb }