const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 8080;

const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');
const morganMiddleware = require('./middlewares/morgan.middleware');

const logger = require('./logging/logger');
const { connectToDb } = require('./database/db');

const sessionConfig = require('./config/sessionConfig');

const authRouter = require('./routes/auth.route');
const { getInitialPrompt, getNextPrompt } = require('./database/queries/prompts');
const { getCurrentPrompt, updateUserPromptProgress } = require('./services/prompt.service');

require('dotenv').config();

// Add the morgan middleware
app.use(morganMiddleware);

app.use( session(sessionConfig) );

require('./authentication/auth');

app.use(passport.initialize());

app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', 'views');

if (process.env.NODE_ENV !== 'test') {
    connectToDb()
}

//To parse url encoded data
app.use(express.urlencoded( {extended: false} ));

//To parse data passed via body
app.use(express.json());

app.use('/api/v1/auth', authRouter);

app.get('/', (req, res) => {
    
    res.sendFile(__dirname + '/index.html');
  
});

io.on('connection', async (socket) => {
    console.log('a user connected');

    //Get current prompt
    let currentPrompt;
    if (!socket.handshake.session) {
        currentPrompt = await getInitialPrompt();
    } else {
        const { _id } = req.user;
        currentPrompt = await getCurrentPrompt(_id);
    }
    
    socket.emit('getPrompt', currentPrompt);

    socket.on('getNextPrompt', async promptText => {
        const nextPrompt = await getNextPrompt(promptText);

        //update user's progress by updating prompt
        if (socket.handshake.session) {
            const { _id } = nextPrompt;
            await updateUserPromptProgress(_id);
        }

        socket.emit('getPrompt', nextPrompt);
    })
    
  });

if (process.env.NODE_ENV !== "test") {
    server.listen(PORT, () => {
        logger.info(`Server is running on PORT ${PORT}`);
    });
}

app.use( errorHandlerMiddleware );