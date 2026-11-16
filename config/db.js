const mongoose =  require('mongoose')
require('dotenv').config()

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connection succesful");
        
    }catch(err){
        console.log(err);
        throw err
        
    }
}

module.exports = connectDB