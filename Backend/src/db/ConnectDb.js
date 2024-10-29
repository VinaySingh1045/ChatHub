import mongoose from "mongoose";

// Connect to MongoDB
const ConnectDb = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected Successfully");
    } catch (error) {
        console.log("Connection failed" , error);
        process.exit(1);
    }
}

export default ConnectDb