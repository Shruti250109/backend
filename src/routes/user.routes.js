import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router()

router.route( "/register").post(registerUser)


// run registUser method written in user.controllers


export default router 