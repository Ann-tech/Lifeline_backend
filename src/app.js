const express = require('express');
const app = express();
const passport = require('passport');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


const PORT = process.env.PORT || 8080;

const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');
const morganMiddleware = require('./middlewares/morgan.middleware');

const logger = require('./logging/logger');
const { connectToDb } = require('./database/db');


const authRouter = require('./routes/auth.route');
const profileRouter = require('./routes/profile.route');
const leaderboardRouter = require('./routes/leaderboardRouter');

const { getInitialPrompt } = require('./database/queries/prompts');
const { getCurrentPrompt, getNextPrompt, updateUserPromptProgress } = require('./services/prompt.service');
const { calculateCurrentScore } = require('./utils');

require('dotenv').config();

app.use( cors({
    origin: "*",
    credentials: true
}) );

// Add the morgan middleware
app.use(morganMiddleware);

require('./authentication/auth');

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

app.use('/api/v1/profile', passport.authenticate('jwt', {session: false}), profileRouter);

app.use('/api/v1/leaderboard', passport.authenticate('jwt', {session: false}), leaderboardRouter);

//will be removed soon
app.get('/', (req, res) => { 
    // return res.status(200).json({message: "Welcome to Lifeline"})
    res.sendFile(__dirname + '/index.html');
});

// app.get('/login', (req, res) => {
//     res.render('login', {error: null});
// });

// app.get('/signup', (req, res) => {
//     res.render('signup', {error: null});
// });

io.use(async (socket, next) => {
    try {
        // Get the request headers
        const headers = socket.request.headers;
        
        // Access a specific request header
        const authorizationHeader = headers['authorization'];

        if (!authorizationHeader) return next();

        const token = authorizationHeader.split(" ")[1];
        
        const { user } = jwt.verify(token, process.env.JWT_SECRET);
        if (user) socket.userId = user._id;
        next();
    } catch (err) {
        logger.error(err);
    }
});
  



io.on('connection', async (socket) => {
    console.log('a user connected');
    
    const user = socket.userId;
   
    //Get current prompt
    let currentPrompt;
    let prompt = {};

    if (!user) {
        currentPrompt = await getInitialPrompt();
        prompt.nextPrompt = currentPrompt;
        prompt.score = 750;
    } else {
        const id = user;
        currentPrompt = await getCurrentPrompt(id);
        prompt = currentPrompt;
        
    }
    
    socket.emit('getPrompt', prompt);

    socket.on('getNextPrompt', async promptInfo => {
        const { promptType } = promptInfo;
        const prompt = await getNextPrompt(promptInfo);
    
        //update user's progress by updating prompt
        let user = socket.userId;
    
        const { nextPrompt } = prompt;
        
        if (user) {
            // const { nextPrompt } = prompt;
            const updatedUser = await updateUserPromptProgress(user, nextPrompt._id, promptType, prompt.isRight, prompt.positiveFeedback, nextPrompt.initialPrompt);
        
            prompt.score = updatedUser.score;
        } else {
            const score = calculateCurrentScore(promptInfo.score, promptType, prompt.isRight, prompt.positiveFeedback, nextPrompt.initialPrompt);
            prompt.score = score;
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