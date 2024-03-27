const  mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email:{
        type:String
    },
    otp:{
        type:String
    }
})
const Otp = mongoose.model("otp",otpSchema);
module.exports = Otp;