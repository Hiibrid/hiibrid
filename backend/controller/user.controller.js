import { User } from "../models/user.model.js"
import expressError from "../utils/expressError.js"
import { ApiResponse } from "../utils/apiResponse.js"




const generateAccessAndRefereshTokens = async (userId) => {
    try {
        console.log(userId);
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
 
    let { username, email, password,phoneno, fullname } = req.body;

    //check the these fields empty or not
    if ([fullname, username, email,phoneno, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new expressError(400, "All fields are required")
    }
    let existedUser = await User.findOne({
        $or: [{ email }, { phoneno }]
    })
    if (existedUser) {
        console.log(existedUser)
        throw new expressError(409, "User with email or password is already Register")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        phoneno,
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


// login route
  const loginController = async (req, res) => {
    // console.log(req.body);
    const {email, phoneno, password} = req.body
    console.log(phoneno);
    // console.log(req.body);
    if (!phoneno && !email) {
        throw new expressError(400, "username or email is required")
    }


    const user = await User.findOne({
        $or: [{phoneno}, {email}]
    })
    

    if (!user) {
        throw new expressError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new expressError(401, "Invalid user credentials")
    }
    // console.log(user._id);

    const { accessToken, refreshToken  } = await generateAccessAndRefereshTokens(user._id);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken , options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

};

//logout controller
const logoutControler = async (req, res) => {
    const userId = req.user._id; // Accessing user ID
    
    await User.findByIdAndUpdate(userId,
        {
            $unset: {
                refreshToken: 1 // Remove the refreshToken field from the document
            }
        },
        {
            new: true
        });

    const options = {
        httpOnly: true,
        secure: true
    };

    // Clear cookies
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res.status(200).json(new ApiResponse(200, {}, "User logout"));
};

export { registerController,loginController,logoutControler };