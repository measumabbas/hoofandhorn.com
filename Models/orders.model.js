const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    farmer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'delivered','cancelled'],
    },
    address:{
        type:String
    },
    quantity:{
        type:String
    }


},{timestamps:true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
