import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if(!token) {
            return res.status(401).json({ msg: "Please login to access this route" });
        }
        console.log( process.env.SECRET_KEY, "hii");
        const decoded = jwt.verify(token, process.env.SECRET_KEY || "4b3a709fcb7e1ced4abe84e7d0257abc1ac4b79f1e0c985a145b4ae021ff4bf7");
        console.log(decoded, process.env.SECRET_KEY, "hii");
        
        if(!decoded) {
            return res.status(401).json({ msg: "Invalid token" });

        } 
        
        const user = await User.findById(decoded.id).select("-password");
        if(!user) {
            return res.status(401).json({ msg: "User not found" });
        }
        req.user = user;
        next();

    }catch(err) {
        return res.status(401).json({msg: "Not authorized to access this route" });

    }

}

export default protectRoute;