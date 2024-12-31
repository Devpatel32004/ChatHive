import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token Provided" });
        }
        const user = await UserModel.findById(decode.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "user not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("protectRoute error is ", error);
        res.status(500).json({ message: "internal server error" });
    }
}



