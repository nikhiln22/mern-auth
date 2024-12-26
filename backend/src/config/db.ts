
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        let data = await mongoose.connect(process.env.MONGODB_URL || '');
        console.log('Database connected successfully');
    } catch (error) {
        console.log('error ocured', error);
    }
}

export default connectDB;