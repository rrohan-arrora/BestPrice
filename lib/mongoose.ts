import mongoose from "mongoose";

let isConnected = false;

async function connectToDB() {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGO_DB_URL) return console.log("Mongo db uri is not defined");

    if(isConnected) return console.log("already connected");

    try{
        await mongoose.connect(process.env.MONGO_DB_URL);
        isConnected = true;

        console.log('mongoDb connected');
    }catch(error: any){
        console.log(error)
    }
}
export default connectToDB;