const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true
    },
    password: {
        type: String,
        minLength: [8, "Password cannot be less than 8 characters"],
        required: [true, 'Please enter password']
    },
    phone:{
        type:String,
        required:[true,'Please Enter Phone number']
    },
    role: {
        type: String,
        required: [true, 'Please enter role'],
        enum: ['farmer', 'user'],
    },
    address:{
        type:String
    }
   
});

module.exports = mongoose.model('User', userSchema);
