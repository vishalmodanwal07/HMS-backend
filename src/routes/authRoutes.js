import { Router } from "express";
import { login, registerUser } from "../controllers/auth.Controller.js";

const authRouter = Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(login);

export default authRouter;


