import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "OneClick",
        });

        console.log(`Connected to the database`);
    }
    catch (error) {
        console.error("Database connection error:", error);
    }
};

export default connectDB;