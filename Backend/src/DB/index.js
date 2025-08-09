import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ConnectDB = async () => {
    try{
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDB successfully connected at ${connection.connection.host}`);
    }catch(err){
        console.log("An Error occured while connecting to Database");
        console.error(err);
    }
}

export default ConnectDB;