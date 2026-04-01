import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()

router.route( "/register").post(
    upload.fields([
      {
        name: "avatar" ,
        //  ye jo aapki field bani hai usse aap kis naam se jaanoge
        maxCount: 1
        //  max kitni fields loge
      },
     {
        "name": "coverImage",
        maxCount: 1
     }
    ]),
    registerUser)
    // register karne se pehle ek middleware chalana padega jis se user ki cheeze upload ho jaye


// run registUser method written in user.controllers


export default router 