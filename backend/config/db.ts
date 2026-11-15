import mongoose from 'mongoose';
// import process from 'process';

const connectDB = async () =>{
    try{
   await mongoose.connect(process.env.MONGO_URL as string);
    console.log("MOngoDb Is connected")
    }
    catch (error){
        console.log("Error in connecting to MongoDb", error);
        process.exit(1);
    }
}

export default connectDB