const express = require('express');
const app = express();

require("dotenv").config();

const CONFIG = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,  
      httpOnly: false, 
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    },
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  CONFIG.cookie.secure = true // serve secure cookies
}

module.exports = CONFIG;