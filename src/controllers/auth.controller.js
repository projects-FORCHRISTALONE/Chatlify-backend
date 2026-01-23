// BY GOD'S GRACE ALONE
import User from "../models/User.js";

import bcrypt from "bcryptjs"

import { generateToken } from "../lib/utils.js"
import { sendWelcomeEmail } from "../../emails/emailHandlers.js";

import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).send({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).send({ message: "Password must be at least 6 characters" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: "Invalid email format" })
        }

        const user = await User.findOne({ email })
        if (user) return res.status(400).send({ message: "Email already exists" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            await newUser.save()
            generateToken(newUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

            try {
                await sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL)

            } catch (err) {
                console.error("Failed to fetch welcome email", err)
            }
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }

    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).send({ message: "Email already exists" })
        }
        console.error(err)
        return res.status(500).send({ message: "Internal server error" })
    }

}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!user || !password) return res.status(400).send({ message: "Email and password required" })
        const user = await User.findOne({ email })
        if (!user) return res.status(400).send({ message: 'Invalid credentials' })

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(400).send({ message: "Invalid credentials" })

        generateToken(user._id, res)


        res.status(200).send({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (err) {
        console.error("Error in login controller:", error)
        res.status(500).send({ message: "Internal server error" })
    }

}

export const logout = (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).send({ message: "Logged out successfully" })
}

export const updateProfile = async (res, req) => {
    try {
        const { profilePic } = req.body

        if (!profilePic) return res.status(400).send({ message: "Profile pic is required" })

        const userId = req.user._id

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePic: uploadResponse.secure_url }, 
            { new: true }
        )

        res.status(200).json(updatedUser)
    } catch (err) {
        console.log("Error in update profile:", err);
        res.status(500).json({message: "Internal server error"})
    }
}

