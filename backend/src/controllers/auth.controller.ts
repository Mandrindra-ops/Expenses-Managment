import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import dotenv from "dotenv";
import { userValidator } from "../validator/user.validator";
dotenv.config();

/**
 * Signup - créer un nouvel utilisateur
 */

dotenv.config();

/**
 * Signup - créer un nouvel utilisateur
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hasher le mot de passe
    // const hashedPassword = await bcrypt.hash(password, 10); -> car déjà hasher dans le user.model.ts de models

    // Créer l'utilisateur
    const user = await User.create({ email, password });
    // Réponse
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Login - authentifier un utilisateur
 */
export const login = async (req: Request, res: Response) => {
  try {
    const result = userValidator(req.body);
    // Vérification des champs requis
    if (result.status === "error") {
      return res.status(400).json({ message: result.data.message });
    }
    const { email, password } = result.data;

    // Chercher l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    // Générer un JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Me - renvoyer les informations de l'utilisateur connecté
 */
export const me = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    res.json({ id: user.id, email: user.email });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
