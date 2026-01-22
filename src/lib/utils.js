// BY GOD'S GRACE ALONE

import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken"

const JWT_SECRET = ENV.JWT_SECRET
if(!JWT_SECRET){
    throw new Error ("JWT_SECRET is not set")
}

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId:userId}, JWT_SECRET, {
        expiresIn: "7d"
    } );

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevents XSS attacks,
        sameSite: "strict", //prevents CSRF atacks
        secure: ENV.NODE_ENV=="development" ? false : true
    });

    return token
}




