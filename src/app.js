const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const sharedsession = require('express-socket.io-session');

const PORT = process.env.PORT || 8080;

const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');
const morganMiddleware = require('./middlewares/morgan.middleware');

const logger = require('./logging/logger');
const { connectToDb } = require('./database/db');

const sessionConfig = require('./config/sessionConfig');
const expressSession = session(sessionConfig);

const authRouter = require('./routes/auth.route');
const leaderboardRouter = require('./routes/leaderboardRouter');

const { getInitialPrompt, getNextPrompt } = require('./database/queries/prompts');
const { getCurrentPrompt, updateUserPromptProgress } = require('./services/prompt.service');

require('dotenv').config();

// Add the morgan middleware
app.use(morganMiddleware);

app.use( expressSession );

require('./authentication/auth');

app.use(passport.initialize());

app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

if (process.env.NODE_ENV !== 'test') {
    connectToDb()
}

//To parse url encoded data
app.use(express.urlencoded( {extended: false} ));

//To parse data passed via body
app.use(express.json());

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/leaderboard', leaderboardRouter);

//will be removed soon
app.get('/', (req, res) => { 
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
    res.render('login', {error: null});
});

app.get('/signup', (req, res) => {
    res.render('signup', {error: null});
});

//to this point

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(expressSession, {
    autoSave:true
})); 

io.on('connection', async (socket) => {
    console.log('a user connected');

    const user = socket.handshake.session.passport?.user;
    console.log(user);
   
    //Get current prompt
    let currentPrompt;
    if (!user) {
        currentPrompt = await getInitialPrompt();
    } else {
        const id = user;
        currentPrompt = await getCurrentPrompt(id);
    }
    
    socket.emit('getPrompt', currentPrompt);

    socket.on('getNextPrompt', async promptText => {
        const prompt = await getNextPrompt(promptText);

        //update user's progress by updating prompt
        let user = socket.handshake.session.passport?.user;

        if (user) {
            
            const { nextPrompt, isRight } = prompt;
            const updatedUser = await updateUserPromptProgress(user, nextPrompt._id, isRight);
        
            prompt.score = updatedUser.score;
        }
        
        socket.emit('getPrompt', prompt);
    })
    
  });

if (process.env.NODE_ENV !== "test") {
    server.listen(PORT, () => {
        logger.info(`Server is running on PORT ${PORT}`);
    });
}

app.use( errorHandlerMiddleware );