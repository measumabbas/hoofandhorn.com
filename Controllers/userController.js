const userSchema = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Otp = require("../Models/otp.model");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone,address } = req.body;

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Duplicate email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userSchema.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address
    });

    return res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ message: "Error saving user" });
  }
};

// GetSingleUser
exports.getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const singleUser = await userSchema.findById(userId);
    if (!singleUser) {
      return res
        .status(404)
        .json({ message: `User with this ${userId} not found` });
    }
    res.status(200).json({ data: singleUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all users

exports.getAllUsers = async (req, res) => {
  try {
    const query ={}
    if(req.query.role === 'user'){
      query.role = 'user'
    }
    if(req.query.role === 'farmer'){
      query.role = 'farmer'
    }
    const users = await userSchema.find(query);
    const filteredUsers = users.filter(user => user.role !== 'admin')
    return res.status(200).json({
      success: true,
      message: "Users found successfully",
      data: filteredUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const removedUser = await userSchema.deleteOne({ _id: userId });
    res.status(201).json({
      message: "User deleted",
      user: removedUser,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//update user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetails = req.body;
    const updatedUser = await userSchema.findByIdAndUpdate(userId, userDetails);
    if (!updatedUser) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    res.status(201).json({
      message: "User Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
// login function

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        messege: `Invalid credentials`,
      });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = jsonwebtoken.sign(
      {
        userEmail: user.email,
        userId: user._id,
        userRole: user.role,
      },
      "farmghar",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "User logged in successfully!",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.forgetPasword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ansaralyh@gmail.com",
        pass: "rbxi feyw kbix rjkd",
      },
    });

    const generatedOTP = crypto.randomBytes(3).toString("hex");
    console.log(generatedOTP);

    const mailOptions = {
      from: "ansaralyh@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${generatedOTP}`,
    };

    await transporter.sendMail(mailOptions);

    const storedOTP = new Otp({
      otp: generatedOTP,
      email,
    });
    await storedOTP.save();

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedOtp = await Otp.findOne({ email, otp });

    if (!storedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();
      await storedOtp.deleteOne();

      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      return res.status(400).json({ error: "User not verified" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
