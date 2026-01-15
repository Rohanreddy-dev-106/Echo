import mongoose from "mongoose";

export default async function Connection() {
    const URL = process.env.MONGODB_CONNECTION;
    try {
        await mongoose.connect(URL);
        console.log("Mongodb is connected");
        
        
    } catch (error) {
        console.log(error.message);

    }
}