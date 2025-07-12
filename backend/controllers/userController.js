import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { emailTemplate } from "../utils/emailTemplate.js";
import { sendMail } from "../utils/transporter.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await newUser.save();

    await sendMail({
      to: email,
      subject: "Verify Your Email - StackIt",
      templateData: {
        SUBJECT: "Verify Your Email - StackIt",
        GREETING: `Hello ${name},`,
        MAIN_MESSAGE:
          "Thank you for signing up to StackIt. Please use the OTP below to verify your email address.",
        HIGHLIGHT_CONTENT: otp,
        SECONDARY_MESSAGE: "This OTP will expire in 1 hour.",
      },
    });

    res.status(201).json({
      message: "User registered. OTP sent to your email.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.isEmailVerified = true;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Email verified successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 60 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendMail({
      to: email,
      subject: "Verify Your Email - StackIt ",
      templateData: {
        SUBJECT: "Verify Your Email - StackIt",
        GREETING: `Hello ${user.name},`,
        MAIN_MESSAGE: "Here's your OTP to verify your email address.",
        HIGHLIGHT_CONTENT: otp,
        SECONDARY_MESSAGE: "This OTP will expire in 1 hour.",
      },
    });

    res.status(200).json({ message: "OTP resent to your email." });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -otp -otpExpiry"
    );
    res.status(200).json(user);
  } catch (error) {
    console.error("Get Logged-in User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
