import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";
import {User}  from "../models/user.model.js";

const registerUser = asyncHandler(async(req , res)=>{
    const { name, email, password, role } = req.body;

    if ([name, email, password , role].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
    }

     const existedUser = await User.findOne({ $or: [{ name } , { email }]});
     if (existedUser) {
      throw new ApiError(409, "User with this email already exists");
     }

      const user = await User.create({
       name,
       email,
       password,
       role,
       });

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
    }

     return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

export {registerUser}