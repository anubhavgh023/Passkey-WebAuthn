import mongoose from "mongoose";

async function connectDb(url) {
    try {
        await mongoose.connect(url);
        console.log("MongoDb connected !");
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

export default connectDb;
