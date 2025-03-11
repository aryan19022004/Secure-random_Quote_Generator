import mongoose from 'mongoose'

async function ConnectToMongoDB(url){
    mongoose.connect(url);
}

export  {
    ConnectToMongoDB,
}