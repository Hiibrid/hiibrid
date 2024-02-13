import mongoose, { Schema } from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs"
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const userSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
    },
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    image:{
        type: String, //from cloudinar
    },
    phoneno:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,  
        required:true
    },
    catogry:{
        type: String,
        required: true
    },
    tenClassMarsheet:{
        type:String, //from cloudinry  
    },
    twelveClassMarsheet:{
        type: String,  //from cloudinry
    },
    degree:{
        type: String, // from cloudinry
    },
    aadharCard:{
        type: String, //from cloudinry
    },
    refreshToken: {
        type: String
    },


    
},{timestamps: true})


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname // Corrected property name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h'




        }
    );
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema);