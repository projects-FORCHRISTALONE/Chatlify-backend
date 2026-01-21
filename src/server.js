// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

app.use("/api/auth",authRoutes );
app.use("/api/messages",messageRoutes );

app.listen(3000, ()=>{
    console.log("App running on port PORT: ", PORT)
})