import express from "express";
import dotenv from "dotenv"
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js"
import userRouter from "./routes/user.route.js"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config({path: "../.env"});
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("connected to db")
}).catch((err) => {
    console.log(err);
})

app.use(cookieParser());
app.use("/api/auth", authRouter); // authentcation
app.use("/api/message", messageRouter);
app.use("/api/users", userRouter);


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
    
});