import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js"

export  const verifyJWT = asyncHandler(async(req , res , next)=>{
  try {
     const token = req.cookies?.accessToken || req.header("Autherization")?.replace("Bearer " , "");
     if(!token){
      throw new ApiError(401 , "unauthorized user")
     }
  
     const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
      throw new ApiError(401, "invalid Access token")
  }
  req.user = user
  next();
  }
  catch(error) {
    throw new ApiError(401 , error?.message || "invalid access token")
  }
})