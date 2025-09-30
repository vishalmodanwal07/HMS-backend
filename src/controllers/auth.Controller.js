import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";
import {User}  from "../models/user.model.js";

const generateAccessAndRefreshToken = async(userId)=>{
   try {
      const user = await User.findById(userId);
      const refreshToken = user.generateAccessToken();
      const accessToken = user.generateAccessToken();
      user.refreshToken=refreshToken;
      await user.save({ validateBeforeSave : false})
      return {accessToken , refreshToken}
   } catch (error) {
     throw new ApiError(500 , "something went wrong while generating refresh token and access token") 
   }
}

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

const login = asyncHandler(async(req , res)=>{
 const { name, email, password } = req.body;
 if(!name && !email){
   throw new ApiError(400 , "username or email are required");
}
const user =await User.findOne({
   $or : [{name} , {email}]
 });
 if(!user){
   throw new ApiError(404 , "user doesnot exist");
 }
 const isPasswordValid = await user.isPasswordCorrect(password);
 if(!isPasswordValid){
   throw new ApiError(401 , "user password incorrect");
 }
const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);
const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
const options ={
   httpOnly : true,
   secure : true
}

return res
.status(200)
.cookie("refreshToken" , refreshToken , options)
.cookie("accessToken" , accessToken , options)
.json(
    new ApiResponse(
    200,
   {
      user : loggedInUser , accessToken , refreshToken
   },
"user loggedin successful")
)
});

export {registerUser,
        login
}