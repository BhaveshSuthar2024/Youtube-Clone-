import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ConnectDB = async () => {
    try{
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in environment variables");
        }
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDB successfully connected at ${connection.connection.host}`);
    }catch(err){
        console.log("An Error occured while connecting to Database");
        console.error(err);
    }
}


export default ConnectDB;
