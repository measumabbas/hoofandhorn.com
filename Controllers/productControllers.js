const productSchema = require("../Models/products.model");
const orderSchema = require("../Models/orders.model");
const userSchema = require("../Models/user.model");
exports.createProduct = async (req, res) => {
  try {
    // const validCategories = ['cows', 'sheeps', 'goat', 'donkey', 'horse'];

    // if (!category || !validCategories.includes(category.toLowerCase())) {
    //     return res.status(400).json({ error: 'Invalid category' });
    // }

    const newProduct = await productSchema.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    console.log(newProduct);
    res.status(201).json({
      success: true,
      message: "Product is added successfully!",
      data: newProduct,
    });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ message: "Error saving product" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const query = {};
    query.status = 'approved'
    if (req.query.category) {
      query.category = req.query.category;
    }

    allProducts = await productSchema.find(query).populate("createdBy");
    return res.status(200).json({
      success: true,
      messege: "Products fetched successfully",
      data: allProducts,
    });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({
      message: "Error fetching product",
    });
  }
};
exports.getAllProductsForAdmin = async (req, res) => {
  try {
    let query = {}
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }

    allProducts = await productSchema.find(query).populate("createdBy");
    return res.status(200).json({
      success: true,
      messege: "Products fetched successfully",
      data: allProducts,
    });
  } catch (error) {
    console.log(error)
    console.error("Save Error:", error);
    res.status(500).json({
      message: "Error fetching product",
    });
  }
};

//get single product
exports.getSinleProduct = async (req, res) => {
  try {
    const prodId = req.params.id;
    const product = await productSchema.findById(prodId).populate("createdBy");
    if (!product) {
      return res
        .status(404)
        .json({ message: `product with this ${prodId} not found` });
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Udate product details

exports.updateProduct = async (req, res) => {
  try {
    const prodId = req.params.id;
    const productDetails = req.body;
    const updatedProduct = await productSchema.findByIdAndUpdate(
      prodId,
      productDetails
    );
    if (!updatedProduct) {
      return res.status(401).json({
        message: "product not found",
      });
    }
    return res.status(201).json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Remove product by id

exports.removeSingleProduct = async (req, res) => {
  try {
    const prodId = req.params.id;
    const removedProd = await productSchema.findByIdAndRemove(prodId);
    if (!removedProd) {
      return res.status(401).json({
        message: "product not found",
      });
    }
    res.status(200).json({
      message: "Deleted Successfully!",
      removedProd,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Remove all products
exports.removeProducts = async (req, res) => {
  try {
    const removedProducts = await productSchema.deleteMany();
    if (!removedProducts) {
      return res.status(401).json({
        message: "product not found",
      });
    }
    res.status(201).json({
      message: "products deleted",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// ****************Farmer's controllers ****************** //

// Get products from Farmer

exports.getAllProductsOfFarmer = async (req, res) => {
  const { productCategory } = req.query;
  try {
    // console.log(req.user)
    const farmer_id = req.user.userId;

    const farmerProducts = await productSchema.find({
      createdBy: farmer_id,
      parent_category: productCategory,
    });

    res.status(200).json({
      success: true,
      message: "Farmer's products fetched successfully",
      data: farmerProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const farmer_id = req.user.userId;

    const currentDate = new Date();
    const twelveMonthsAgo = new Date(currentDate);
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

    const orders = await orderSchema.find({
      farmer_id,
      createdAt: {
        $gte: twelveMonthsAgo,
        $lt: currentDate,
      },
    });

    const monthlyData = Array(12)
      .fill()
      .map((_, index) => {
        const month = (currentDate.getMonth() + 12 - index) % 12;
        const monthName = new Date(0, month).toLocaleString("default", {
          month: "short",
        });
        const ordersCount = orders.filter(
          (order) => new Date(order.createdAt).getMonth() === month
        ).length;
        return { name: monthName, orders: ordersCount };
      });
    const products = await productSchema.find({ createdBy: farmer_id });
    const totalOrders = await orderSchema.find({ farmer_id });
    const completed = await orderSchema.find({
      farmer_id,
      status: "delivered",
    });
    const pending = await orderSchema.find({ farmer_id, status: "pending" });

    const data = {
      total_products: products.length,
      totalOrders: totalOrders.length,
      completedOrders: completed.length,
      pendingOrders: pending.length,
      graph:monthlyData.reverse()
    };

    res.status(200).json({
      success: true,
      message: "Operation successfull",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDashboardDataForAdmin = async (req, res) => {
  try {
    const currentDate = new Date();
    const twelveMonthsAgo = new Date(currentDate);
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

    const orders = await orderSchema.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lt: currentDate,
      },
    });

    const monthlyData = Array(12)
      .fill()
      .map((_, index) => {
        const month = (currentDate.getMonth() + 12 - index) % 12;
        const monthName = new Date(0, month).toLocaleString("default", {
          month: "short",
        });
        const ordersCount = orders.filter(
          (order) => new Date(order.createdAt).getMonth() === month
        ).length;
        return { name: monthName, orders: ordersCount };
      });
    const totalProducts = await productSchema.find();
    const totalOrders = await orderSchema.find();
    const totalUsers = await userSchema.find();
    const pendingProducts = await productSchema.find({ status: "pending" });

    res.status(200).json({
      totalProducts: totalProducts.length,
      totalOrders: totalOrders.length,
      totalUsers: totalUsers.length,
      pendingProducts: pendingProducts.length,
      graph: monthlyData.reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.createProductReview = async (req, res) => {
  const { id } = req.params;
  const { user_id, rating } = req.body;

  try {
    const product = await productSchema.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingRating = product.reviews.find(review => review.user_id.toString() === user_id);

    if (existingRating) {
      return res.status(400).json({ message: 'User has already reviewed this product' });
    }

    product.reviews.push({ user_id, rating });
    product.numOfReviews += 1;

    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.ratings = totalRating / product.numOfReviews;

    await product.save();

    res.status(200).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};