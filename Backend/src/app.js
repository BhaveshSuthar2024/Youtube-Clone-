import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import GlobalErrorHandler from './Controllers/GlobalErrorHandler.js';
import authRouter from './Routes/Auth.route.js'
import videoRouter from './Routes/Video.route.js';
import channelRouter from './Routes/Channel.route.js';
import commentRouter from './Routes/Comment.route.js';
import userRouter from './Routes/User.route.js';
import playlistRouter from './Routes/Playlist.route.js'

export const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({
    limit: "16kb",
}));

app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/channel', channelRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/playlist', playlistRouter);

app.use(GlobalErrorHandler);