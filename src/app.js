const express = require('express');
const app = express();
const passport = require('passport');
const cors = require('cors');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const PORT = process.env.PORT || 8080;

const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');
const morganMiddleware = require('./middlewares/morgan.middleware');

const logger = require('./logging/logger');
const { connectToDb } = require('./database/db');


const authRouter = require('./routes/auth.route');
const leaderboardRouter = require('./routes/leaderboardRouter');

const { getInitialPrompt, getNextPrompt } = require('./database/queries/prompts');
const { getCurrentPrompt, updateUserPromptProgress } = require('./services/prompt.service');
const { calculateCurrentScore } = require('./utils');

require('dotenv').config();

app.use( cors() );

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

app.use('/api/v1/leaderboard', passport.authenticate('jwt', {session: false}), leaderboardRouter);

//will be removed soon
app.get('/', (req, res) => { 
    return res.status(200).json({message: "Welcome to Lifeline"})
    // res.sendFile(__dirname + '/index.html');
});

// app.get('/login', (req, res) => {
//     res.render('login', {error: null});
// });

// app.get('/signup', (req, res) => {
//     res.render('signup', {error: null});
// });



io.on('connection', async (socket) => {
    console.log('a user connected');

    const user = socket.request.user?.id;
   
    //Get current prompt
    let currentPrompt;
    let prompt = {};

    if (!user) {
        currentPrompt = await getInitialPrompt();
        prompt.nextPrompt = currentPrompt;
        prompt.score = 0;
    } else {
        const id = user;
        currentPrompt = await getCurrentPrompt(id);
        prompt = currentPrompt;
    }

    
    socket.emit('getPrompt', prompt);

    socket.on('getNextPrompt', async promptInfo => {
        const prompt = await getNextPrompt(promptInfo.promptText);

        //update user's progress by updating prompt
        let user = socket.request.user?.id;

        if (user) {
            
            const { nextPrompt, isRight } = prompt;
            const updatedUser = await updateUserPromptProgress(user, nextPrompt._id, isRight);
        
            prompt.score = updatedUser.score;
        } else {
            const score = calculateCurrentScore(promptInfo.score, prompt.isRight);
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