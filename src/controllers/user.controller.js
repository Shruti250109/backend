import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async( req,res)=>{
    // steps:
    // get user details from frontend or postman if no frontend
    // validation - not empty or more
    // check if user already exists : username , email
    // check for images , check for avatar
    //  upload them to cloudinary, avatar check karna sahi se upload hua ya nahi
    // create user object- create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response


    const {fullName,email, username, password}=req.body
    console.log("email:", email);

    // validation karo abb 
    // if(fullName==="")
    // {
    // throw new ApiError(400, "fulname is required")
    // } aisehi sabke lie condition laga do vut there is another method jisme sabko array me pass krte hai aur .some method use krte hai
    if([fullName,email, username, password].some((field)=> 
    field?.trim()===""))
    {
        throw new ApiError(400,"All Fields Are Required")
    }
//    agar field hui toh usse trim karo aur agar trim karne ke baad bhi " " mile toh give error
  const existedUser= User.findOne({
    $or : [{username},{email}]
   })
   if(existedUser)
   {
    throw new ApiError(409,"User with email or username already exists")
   }
//    check karo if user already exists with help of $or operator and return error if true
  const avatarLocalPath = req.files?.avatar[0]?.path;
//   avatar ki file ka localpath mil jaega , req.files? islie lagaya hai ki kya pata na mile
const coverImageLocalPath = req.files?.coverImage[0]?.path;
// cover image mandatory nahi hai hona islie if condition nhi lagaege uske lie
 if( !avatarLocalPath)
 {
    throw new ApiError ( 400, "Avatar file is required")
 }
//   next step after this is upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
// time lagta hai ilsie await lagao and store the response 
 if( !avatar)
 {
    throw new ApiError ( 400, "Avatar file is required")
 }
//   avatar is mandatory toh kisi bhi reason se nahi hua toh give error
  const user= await User.create({
    fullName,
    avatar: avatar.url,
    coverImage:coverImage?.url || "",
    // since coverImage pakka nahi dhang se upload hui hai, agar hui hai toh url rakh do warna khali chor do since wasnt mandatory
    email,
    password,
    username : username.toLowerCase()
})
const createdUser = await User.findById(user._id).select(
    "password -refreshToken"
)
//  ye dono ke alawa sab kuch selected hota hai by default toh ye dono nahi aaegi

if(!createdUser){
 throw new ApiError (500, " Something went wrong while registering the user")

}
return res.status(201).json(
 new ApiResponse(200, createdUser, "User registered succesfully")
)
    

})

export {registerUser}