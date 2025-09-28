import express from "express"
import { loginUser,registreUser } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.post('/register',registreUser);
userRouter.post('/login',loginUser);


export default userRouter;