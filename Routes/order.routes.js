const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orders.controllers');
const { authenticateUser } = require('../middlewares/authentication');

// Create a new order
router.post('/orders/create', orderController.createOrder);

// Get all orders
router.get('/orders/view', orderController.getAllOrders);

// Get single orders
router.get('/orders/view/:id', orderController.getSingleOrderById);

// remove order by id 
router.delete('/orders/delete/:id', orderController.removeOrder)

//Update order by id
router.put('/orders/update/:id', orderController.updateOrder)

module.exports = router;
