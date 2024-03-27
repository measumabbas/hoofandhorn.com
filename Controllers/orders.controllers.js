const Order = require("../Models/orders.model");
const User = require("../Models/user.model");
const Product = require("../Models/products.model");

exports.createOrder = async (req, res) => {
  try {
    console.log("Here");
    const { user_id, farmer_id, product_id, address, quantity } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const order = new Order({
      user_id,
      farmer_id,
      product_id,
      address,
      quantity,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};
exports.getAllOrders = async (req, res) => {
  const { category } = req.query;
  console.log(category);
  try {
    const allOrders = await Order.find()
      .populate("user_id")
      .populate("farmer_id")
      .populate("product_id");

    const finalOrders = allOrders.filter(
      (order) => order.product_id.parent_category === category
    );
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: finalOrders,
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get single order by id
exports.getSingleOrderById = async (req, res) => {
  try {
    const order_id = req.params.id;

    const order = await Order.findById(order_id);

    if (!order) {
      return res
        .status(404)
        .json({ message: "No order found with the provided ID" });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove the order by id

exports.removeOrder = async (req, res) => {
  try {
    const order_id = req.params.id;

    const order = await Order.findByIdAndRemove(order_id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "No order found with the provided ID" });
    }
    res.status(201).json({
      success: true,
      message: "Order deleted successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Update existing order

exports.updateOrder = async (req, res) => {
  try {
    const order_id = req.params.id;

    const order = await Order.findById(order_id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "No order found with the provided ID" });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      { status: req.body.status },
      { new: true }
    );

    const product = await Product.findById(req.body.product_id);

    if (product.parent_category === "1") {
      product.isSold = true;
    }
    if (product.parent_category === "0") {
      product.stock = parseInt(product.stock) - parseInt(order.quantity);
    }
    await product.save();
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
