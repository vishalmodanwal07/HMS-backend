import { Router } from "express";
import { login, logout, registerUser } from "../controllers/auth.Controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(verifyJWT , logout);

export default authRouter;


