import express from "express";
import fs from "fs";
import { sign, verify } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";
import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";
import User, { findOne, findById, find } from "../models/User.js";
import sendMail from "./mailController.js";
import cookieParser from "cookie-parser";
config();

const authController = express();
authController.use(cookieParser());

authController.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(500).json({ message: "Error saving user" });
    }
    res.status(201).json({ message: "User registered successfully" });
    const mailOptions = {
      to: email,
      subject: "Registration Notification",
      text: `Hello ${name},\n\nYou have successfully registered to your account.\n\nBest regards,\nYour Company`,
    };
    await sendMail(mailOptions);  
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

authController.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };  

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

    const mailOptions = {
      to: user.email,
      subject: "Login Notification",
      text: `Hello ${user.name},\n\nYou have successfully logged in to your account.\n\nIf this wasn't you, please contact support immediately.\n\nBest regards,\nYour Company`,
    };
    await sendMail(mailOptions);

  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
});

authController.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

authController.get("/profile", async (req, res) => {
    try {
    const token = req.cookies.token || (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await findById(decoded.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }   
    res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
    });
    } catch (error) {
    res.status(500).json({ message: "Error getting user profile" });
    }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

authController.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await find({}, "name email");
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users" });
  }
});

authController.put("/profile", async (req, res) => {
  try {
    const token = req.cookies.token || (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    res.status(200).json({
      message: "Profile updated successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default authController;
