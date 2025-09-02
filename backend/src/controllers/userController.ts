import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { createUserModel } from "../models/userModel";
import sequelize from "../config/database";
import { log } from "console";

const User = createUserModel(sequelize);
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user WITHOUT userId
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      // role defaults to 'user'
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user.getDataValue("userId"),
      username: user.getDataValue("username"),
      email: user.getDataValue("email"),
      role: user.getDataValue("role"),
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, user.getDataValue("password"));
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.getDataValue("userId"), role: user.getDataValue("role") },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.json({
      userId: user.getDataValue("userId"),
      username: user.getDataValue("username"),
      email: user.getDataValue("email"),
      role: user.getDataValue("role"),
      token,
    })



  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { userId: req.get("userId") }, attributes: { exclude: ["password"] } })
    console.log(user);
    
    res.json(user); 
    // res.get("userId");
    // const userId = (req as Request).get("userId");
    // if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // console.log("User ID from request:",) userId);
    // const user = await User.findByPk(userId, {
    //   attributes: { exclude: ["password"] },
    // });
    // if (!user) return res.status(404).json({ message: "User not found" });

    // res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};  
