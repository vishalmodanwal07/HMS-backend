import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
       type : String,
       required : true,
       unique : true,
       lowercase : true
    },
    password : {
          type : String,
          required : true,
    },
    role : {
        type : String,
        enum: ['Admin','Doctor','Reception','Lab'],
        required: true
    },
    createdAt : {
        type: Date,
        default: Date.now 
    }
     
} , {timestamps : true});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password , this.password);
}


UserSchema.methods.generateAccessToken = function(){
  return  jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        fullName : this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
}
UserSchema.methods.generateRefershToken =function(){
    return  jwt.sign(
        {
        _id : this._id,
        },
       process.env.REFRESH_TOKEN_SECRET ,
       { 
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
       })
}

export const User = mongoose.model("User" , UserSchema);