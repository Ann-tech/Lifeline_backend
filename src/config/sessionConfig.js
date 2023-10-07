require("dotenv").config();

const CONFIG = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,  
      httpOnly: false, 
      maxAge: 1000 * 60 * 10, 
    },
}

module.exports = CONFIG;