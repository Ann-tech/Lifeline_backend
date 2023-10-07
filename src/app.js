const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
}

