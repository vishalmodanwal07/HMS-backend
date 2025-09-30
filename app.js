import express , {Router} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./src/routes/authRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import patientRouter from "./src/routes/patientRoutes.js";
import labRouter from "./src/routes/labreportRoutes.js";
import billRouter from "./src/routes/billRoutes.js";

const app = express();

//app configrations--> all configration is basically use() method   app.use()
app.use(cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true , limit:"16kb"}));
app.use(express.static("publicuse"));  
app.use(cookieParser());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);        // admin-only user management
app.use('/api/v1/patients', patientRouter); // reception/doctor access
app.use('/api/v1/labs', labRouter);         // lab uploads
app.use('/api/v1/bills', billRouter);       // billing



export default app;