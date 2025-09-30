import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {  deleteUser, getUserById, getUsers, updateUser } from "../controllers/user.Controller.js";

const userRouter = Router();

userRouter.route("/").get(verifyJWT , authorize("Admin") , getUsers);
userRouter.route("/:id").get(verifyJWT , authorize("Admin") , getUserById);
userRouter.route("/:id").put(verifyJWT , authorize("Admin") , updateUser);
userRouter.route("/:id").delete(verifyJWT , authorize("Admin") , deleteUser);


export default userRouter;