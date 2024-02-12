import expressError from "../utils/expressError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

export const verifyJWT  = async (req, res, next) => {
    let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
    
    if (!token) {
        throw new expressError(401, " Unauthorized request")
    }
    let decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    let user = await User.findById(decodeToken._id).select("-password -refreshToken");
    
    if (!user) {
        throw new expressError(401, "Invalid AccessToken");
    }
    req.user = user;
    next();
}