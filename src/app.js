const express = require('express');
const app = express();
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');

const PORT = process.env.PORT || 8080;

const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');
const morganMiddleware = require('./middlewares/morgan.middleware');

const logger = require('./logging/logger');
const { connectToDb } = require('./db');

const sessionConfig = require('./config/sessionConfig');

app.use( helmet() );

require('dotenv').config();

// Add the morgan middleware
app.use(morganMiddleware);

app.use( session(sessionConfig) );

require('./authentication/auth');

app.use(passport.initialize());

app.use(passport.session());

if (process.env.NODE_ENV !== 'test') {
    connectToDb()
}

//To parse url encoded data
app.use(express.urlencoded( {extended: false} ));

//To parse data passed via body
app.use(express.json());


if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        logger.info(`Server is running on PORT ${PORT}`);
    });
}

app.use( errorHandlerMiddleware );