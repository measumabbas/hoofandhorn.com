const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    address: {
      type: String,
    },
    parent_category: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        "cow",
        "sheep",
        "goat",
        "donkey",
        "horse",
        "milk",
        "butter",
        "cheese",
        "yogurt",
        "chicken",
        "hen",
      ],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "sold"],
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    stock: {
      type: String,
    },
    unit: {
      type: String,
      enum: ["KG", "LTR"],
    },
    reviews: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
        },
      },
    ],
    numOfReviews: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
