import { userModel } from "../models/user.model.js"
import { status } from "http-status";
import bcrypt from "bcrypt"
import crypto from "crypto";
export class userController {
    //user login
    static login = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(status.BAD_REQUEST).json({ message: "All fields are required." });
        }

        try {
            const user = await userModel.findOne({ email: email });
            if (!user) {
                return res.status(status.NOT_FOUND).json({ message: "User not found with this email." });
            }
            const foundPassword = await bcrypt.compare(password, user.password);
            if (foundPassword) {
                let token = crypto.randomBytes(20).toString("hex");
                user.token = token;
                await user.save();
                return res.status(status.OK).json({ message: "Login successful.", token: token });
            } else {
                return res.status(status.BAD_REQUEST).json({ message: "User not found with this email and password." });
            }
        } catch (e) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong. ${e}.` })
        }
    }


    //creating new user
    static register = async (req, res) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(status.BAD_REQUEST).json({ message: "All fields are required" });
        }

        try {
            const existingUser = await userModel.findOne({ email: email });
            if (existingUser) {
                return res.status(status.CONFLICT).json({ message: "User already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                token: "",
            })
            await newUser.save();
            return res.status(status.CREATED).json({ message: "User registered successfully" });
        } catch (e) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong. ${e}` })
        }
    }


    //getting call logs
    static get_all_activity = (req, res) => {

    }


    //adding call log
    static add_activity = (req, res) => {

    }
}