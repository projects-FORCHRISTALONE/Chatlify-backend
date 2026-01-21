// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import path from "path"
import "./keepAlive.js"

dotenv.config()

const app = express()
const __dirname = path.resolve() 

const PORT = process.env.PORT || 3000

app.use("/api/auth",authRoutes );
app.use("/api/messages",messageRoutes );

if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

console.log(__dirname)
app.listen(3000, ()=>{
    console.log("App running on port PORT: ", PORT)
})