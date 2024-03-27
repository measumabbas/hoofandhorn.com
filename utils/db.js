const mongoose = require('mongoose')
const connectToDb = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/Farmghar", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('MongoDB connected successfully');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
};

module.exports = connectToDb