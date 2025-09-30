import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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

export const User = mongoose.model("User" , UserSchema);