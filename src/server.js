// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import path from "path"
import "./keepAlive.js"
import mongoose from "mongoose"

dotenv.config()

const app = express();

app.use(express.json())

const __dirname = path.resolve() 

const PORT = process.env.PORT

app.use("/api/auth",authRoutes );
app.use("/api/messages",messageRoutes );


mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(()=>{
            console.log("Connected to mongoDB successfully")
            app.listen(PORT, ()=>{
                console.log("App running on port PORT: ", PORT)
            })
    })
    .catch((err)=>{
        console.log(err.message)
    })
