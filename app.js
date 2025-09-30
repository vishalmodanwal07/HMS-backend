import express , {Router} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

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



export default app;