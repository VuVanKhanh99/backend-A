const mongoose = require('mongoose');


const connectDB = async ()=>{
    try {
        const connect =await mongoose.connect(process.env.MONGODB_URI);

        console.log(`Moongodb connect ${(await connect).connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB