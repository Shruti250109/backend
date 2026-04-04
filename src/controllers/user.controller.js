import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId)=>{
  try {
    const user= await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken= refreshToken
    // object me iss tarah add karte hai refreshtoken
   await user.save({validateBeforeSave : false})
    //  save karte time kick in ho jata kyuki password bhi chahie hoga usse to save toh validatebeforesave ko false kar dete taaki password naa ho necessary
  //  refresh token ko hamesha database me jaake store karate hai
   return {accessToken, refreshToken}

  } catch (error) {
    throw new ApiError(500, "something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler(async( req,res)=>{
    console.log("REGISTER API HIT");
    console.log("FILES:", req.files);
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
  const existedUser= await User.findOne({
    $or : [{username},{email}]
   })
   if(existedUser)
   {
    throw new ApiError(409,"User with email or username already exists")
   }
//    check karo if user already exists with help of $or operator and return error if true
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   avatar ki file ka localpath mil jaega , req.files? islie lagaya hai ki kya pata na mile
 let coverImageLocalPath;
 if( req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0)
 {
  coverImageLocalPath = req.files.coverImage[0].path
 }
// cover image mandatory nahi hai hona islie if condition nhi lagaege uske lie
 if(!avatarLocalPath)
 {
    throw new ApiError ( 400, "Avatar file is required")
 }
//   next step after this is upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
// time lagta hai ilsie await lagao and store the response 
 if(!avatar)
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
    "-password -refreshToken"
)
//  ye dono ke alawa sab kuch selected hota hai by default toh ye dono nahi aaegi

if(!createdUser){
 throw new ApiError (500, " Something went wrong while registering the user")

}
return res.status(201).json(
 new ApiResponse(200, createdUser, "User registered succesfully")
)
    

})

const loginUser=asyncHandler(async( req,res)=>{
//   req body se data le aao
// username or email
// find the user
// password check
// access and refresh token generate
// send cookies
  
const {email, username, password}= req.body
console.log(email);
if(!username && !email)
{
  throw new ApiError(400, "username or email is required")
}
// username ya email dono me se kuch bhi ho toh chalega warna error
 const user= await User.findOne({
  $or :[{username}, {email}]
})
// findone find karta hai value on the basis of either username or email

if(!user)
{
  throw new ApiError( 404, " user does not exist")
}
// agar user mila nahi matlb exist nahi karta

 const isPasswordValid = await user.isPasswordCorrect(password)
//  ispassowordcorrect bycrypt wala hi function jo check karta hai ki given password matches or not
// current user ka aur ispasswordvalid ki value true ya false me aaegi

if(!isPasswordValid)
{
  throw new ApiError( 401, "invalid user credentials")
}

// ab refresh aur access token generate hone ka function bahot jagah use hoga toh usse upoar banaya hai alag se method me
 const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id)

// method call karke destructure karke le lo

const loggedInUser= await User.findById(user._id).select( "-password -refreshToken")
// gives everything except password and refreshedtoken field

// ab cookies ke lie :
const options= {
  httpOnly : true,
  secure : true
}
// ab ye cookies modifiable sirf server se hongi , frontend se nahi

return res.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
  new ApiResponse(
    200,
    {
      user: loggedInUser , accessToken , refreshToken
    },
    "User logged in successfully"
  )
)

})

// ab logout dekhege
const logoutUser = asyncHandler ( async( req, res) =>{
  // refresh token user.models ke andar se gayab karna padega
 await User.findByIdAndUpdate(req.user._id, {
  $set : {
    refreshToken : undefined
  }
  
} , {
  new : true
})
 const options= {
  httpOnly : true,
  secure : true
}
return res.status(200).clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200 , {}, "user logged out successfully" ))

})
//  new islie taaki response jo mile usme undefined matln new value aaye warna refreshtoken aa jata
const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    // kya pata kisi ne body di ho toh tab ke loe req.body.refreshTOken
  if(!incomingRefreshToken )
  {
    throw new ApiError(401, "Unauthorized request")
  }
   try {
    const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
      
    const user = await User.findById (decodedToken?._id)
     
    if(!user )
   {
     throw new ApiError(401, "Invalid refresh token")
   }
 
   if(incomingRefreshToken !== user?.refreshToken)
   {
     throw new ApiError(401, "refresh token is expired or used")
   }
 
   const options = {
     httpOnly :true,
     secure : true
   }
    
     const {accessToken, newRefreshToken}= await generateAccessAndRefreshTokens(user._id)
 
   return res.status(200)
   .cookie("accessToken" , accessToken , options)
   .cookie("refreshToken", newRefreshToken, options)
   .json(
     new ApiResponse(
       200,
       {accessToken , refreshToken : newRefreshToken},
       "Access toke refreshed"
     )
   )
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
   }

})

export {registerUser, loginUser, logoutUser , refreshAccessToken}