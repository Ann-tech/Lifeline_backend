const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware')

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
}

app.use( errorHandlerMiddleware );