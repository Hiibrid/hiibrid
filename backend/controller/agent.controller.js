import { Agent } from "../models/agent.model.js";
import expressError from "../utils/expressError.js";
import { ApiResponse } from "../utils/apiResponse.js"


//generateAccessAndRefereshTokens

const generateAccessAndRefereshTokens = async (agent_id) => {
    try {
        console.log(agent_id);
        const agent = await Agent.findById(agent_id)
        const accessToken = agent.generateAccessToken()
        const refreshToken = agent.generateRefreshToken()

        agent.refreshToken = refreshToken
        await agent.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new expressError(500, "Something went wrong while generating referesh and access token")
    }
}

const agentRegisterController = async (req, res) => {
    console.log(req.body);
    let { username, password, email } = req.body;
    //check the these fields empty or not
    if ([username, email, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new expressError(400, "All fields are required")
    }

    let existedAgent = await Agent.findOne({
        $or: [{ email }, { username }]
    })

    if (existedAgent) {
        throw new expressError(400, "agent already exist")
    }

    let agent = await Agent.create({
        username: username.toLowerCase(),
        email,
        password,
    });
    //remove password or reFreshToken fields from response
    let createdAgent = await Agent.findById(agent._id).select("-password -refreshToken");

    if (!createdAgent) {
        throw new expressError(500, "Something went wrong while Register the agent");
    }

    res.status(201).json(
        new ApiResponse(200, createdAgent, " agent created succesfully")
    )
}




const agentLoginController = async (req, res) => {
    let { password, username, email } = req.body;
    if (!email && !username) {
        throw new expressError(400, "username or email required");
    };

    let agent = await Agent.findOne({
        $or: [{ email }, { username }]
    });

    if (!agent) {
        throw new expressError(404, "agent not exist");
    };
    //check password
    const isPasswordValid = await agent.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new expressError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(agent._id);

    const loggedInAgnet = await Agent.findById(agent._id).select("-password -refreshToken")

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
                user: loggedInAgnet, accessToken, refreshToken
            },
            "agent logged In Successfully"
        )
    )



};

export { agentRegisterController,agentLoginController };