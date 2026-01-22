// BY GOD'S GRACE ALONE
import User from "../models/User.js";

import bcrypt from "bcryptjs"

import {generateToken }from "../lib/utils.js"
import { sendWelcomeEmail } from "../../emails/emailHandlers.js";

import { ENV } from "../lib/env.js";


export const signup = async (req,res)=> {
    try{
        const {fullName, email, password} = req.body;

        if (!fullName || !email || !password){
            return res.status(400).send({message: "All fields are required"})
        }

        if (password.length < 6){
            return res.status(400).send({message: "Password must be at least 6 characters"})
        }

        const  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)){
            return res.status(400).send({message: "Invalid email format"})
        }

        const user = await User.findOne({email})
        if(user) return res.status(400).send({message: "Email already exists"})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser){
            await newUser.save()
            generateToken(newUser._id,res)

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

            try{
                await sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL)

            } catch(err){
                console.error("Failed to fetch welcome email", err)
            }
        }else {
            res.status(400).json({message: "Invalid user data"})
        }

    }catch(err){
       if (err?.code === 11000) {
           return res.status(409).send({ message: "Email already exists" })
       }
       console.error(err)
       return res.status(500).send({ message: "Internal server error" })
   }
    
}

