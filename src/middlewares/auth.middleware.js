import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

// ye verify karega ki user hai ki nahi , this is mainly constructed for logout step
export const verifyJWT = asyncHandler(async(req,res,next)=>{
 try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace( "Bearer ", "")
       // that header wala part iis for mobile applications
   //  Agar token nahi hai toh
    if( !token)
    {
       throw new ApiError( 401, "Unauthorized request")
    }
   
     const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
     const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
   
     if( !user)
     {
       throw new ApiError(401, "Invalid access token")
     }
     req.user= user;
   //   req ke andar naya object add kar dia
   next()
   
 } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
 }
})

