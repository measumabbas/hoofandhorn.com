const mongoose = require('mongoose')


const doctorSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    field:{
        type:String
    },
    status:{
        type:String,
        default:'pending',
        enum:["approved","pending"]
    }
})



module.exports = mongoose.model("Doctor",doctorSchema)