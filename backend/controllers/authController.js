import { generateToken } from "../lib/utils.js";
import UserModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import cloudinary from "../lib/cloudinary.js"

export const signUpUser = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "all fiels are requiered" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "email already exist" });
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            email,
            fullName,
            password: hashedpassword
        })

        if (newUser) {
            // generating jwt token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' })
        }

    } catch (error) {
        console.log("signUpUser error is ", error);
        res.status(500).json({ message: "internal server error" })
    }
}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "all fiels are requiered" });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user does not exist" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        generateToken(user._id, res);
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("loginUser error is ", error);
        res.status(500).json({ message: "internal server error" })
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token").json({ message: "logged out successfully" });
    } catch (error) {
        console.log("logoutUser error is ", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: "profile picture required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await UserModel.findByIdAndUpdate(req.user._id,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );
        res.status(201).json(updatedUser);
    } catch (error) {
        console.log("update profile error is ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};