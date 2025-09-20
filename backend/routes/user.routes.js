import express from "express";
import { userController } from "../controller/user.controller.js";

const userRouter = express.Router();


userRouter.post("/login", userController.login);

userRouter.post("/register", userController.register)

userRouter.get("/get_all_activity", userController.get_all_activity)

userRouter.post("/add_activity", userController.add_activity)


export default userRouter;