import { User } from "../models/user.model.js"
import expressError from "../utils/expressError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudconfig.js"
import jwt from "jsonwebtoken"



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new expressError(500, "Something went wrong while generating referesh and access token")
    }
}

//register route
const registerController = async (req, res) => {

    let { username, email, password, fullname } = req.body;

    //check the these fields empty or not
    if ([fullname, username, email, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new expressError(400, "All fields are required")
    }
    let existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        console.log(existedUser)
        throw new expressError(409, "User with email or password is already Register")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password
    });

    //remove password or reFreshToken fields from response
    let createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new expressError(500, "Something went wrong while Register the user");
    }

    res.status(201).json(
        new ApiResponse(200, createdUser, " User created succesfully")
    )

};
export { registerController };