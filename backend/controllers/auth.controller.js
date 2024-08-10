import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
export const userSignUp = async (req, res) => {
    
    const { fullname, email, password, gender } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const username = email.split("@")[0];
        console.log();
        
        const user = new User({ fullName:fullname, username, email, password: hashedPassword, gender });
        await user.save();

        res.status(201).json({ message: "User created successfully" });

    }
    catch(err) {
        console.log(err);
    }
}
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }); 
        
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET); // create token to store in cookie
        const { password: pass, ...rest } = user._doc;
        res
        .cookie('access_token', token) // store token in cookies
        .status(200)
        .json(rest);
    }
    catch(err) {
        console.log(err);
    }
}

export const userLogOut = async (req, res) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json({ message: "Logged out successfully" });
    }catch(err) {
        console.log(err);
        
    }
}