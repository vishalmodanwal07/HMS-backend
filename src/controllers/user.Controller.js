import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js"

const getUsers = asyncHandler(async(req , res)=>{
    const users = await User.find().select("-password -refreshToken");
    if(!users){
        throw new ApiError(200 , "no user");
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , users , "Users fetched successfull"));     
});

const getUserById = asyncHandler(async(req , res)=>{
     const {id} = req.params.id;
     const user = await User.findById(id).select("-password -refreshToken");
     if (!user) throw new ApiError(404, "User not found");
     return res
     .status(200)
     .json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUser = asyncHandler(async(req , res)=>{
   const { name, email, role } = req.body;
   const {id} = req.params.id;
   const user = await User.findByIdAndUpdate(id , {
    name ,
    role ,
    email
   },
   {new : true}
).select("-password -refreshToken");
 if (!user) throw new ApiError(404, "User not found");
 return res
 .status(200)
 .json(new ApiResponse(200, user, "User updated successfully"));

});

const deleteUser = asyncHandler(async(req , res)=>{
  const {id} = req.params.id;
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  return res
  .status(200)
  .json(new ApiResponse(200, null, "User deleted successfully"));

});

export {getUsers , getUserById , updateUser , deleteUser}