import app from "./app.js";
import { config } from "dotenv";
import connectDB from "./config/db.js";

config({path:'.env'});






connectDB()
.then(()=>{
     app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server is running at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("mongodb connection failed", err);
})

