import ConnectDB from "./DB/index.js";
import { app } from './app.js'
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

ConnectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server Started listning on ${process.env.PORT}`);
    });
});