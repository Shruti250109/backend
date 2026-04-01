import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
// bcrypt is a library to hide your password
// direct encryption possible nhi toh we use mongoose ke hooks ki, open mongoose documentation and search for pre hook by searching middlewares 
// pre hook is used jab data ke save hone se just pehle kuch kar de

const userSchema= new Schema({
    username: {
        type : String,
        required : true,
        unique : true,
        lowercase: true,
        trim : true,
        index : true
    },
    // kisi bhi field ko agar easily searchable banana hai toh uska index true kar dete hai aur isme user ki id nahi banaege kyuki mongoDB khud ek unique id de deta hai
    email: {
        type : String,
        required : true,
        unique : true,
        lowercase: true,
        trim : true
    },
    // sabko index nahi kia jata hai warna band baj jaegi
    fullname: {
        type : String,
        required : true,
        trim : true,
        index : true

    },
    avatar :{
     type : String, 
     required : true
    },
    // image ko AWS ko dete hai aur wo URL bana ke de detas hai uska

    coverimage: {
        type : String
    },
     watchHistory :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
     ],
     password :{
        type :String ,
        required :[ true, 'password is required']
     },
     refreshToken :{
        type : String,
     }

},
{
    timestamps: true
}
)

userSchema.pre("save",  async function(next){
    if(!this.isModified("password")) return next();
    this.password =  await bcrypt.hash(this.password, 10)
    next()
})
// agar koi banda apna avatar change karke gaya and save kia tab toh wapis se password encrypt kar dega faltu me islie jab password change ho tabhi bcrype use karna 
// condition me likha hai ki modify nahi hua toh aage badho warna bcrypt use kro
//  async hoga ye function kyuki encryption me time lagta hai aur next islie parameter hoga kyuki middleware hai ye , toh ek kaam hua toh next badho
// bcrypt function me kya hash karna hai wo dalna hota hai and is 10 indicates number of rounds


userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password)
}
// compare karta hai user ka given password aur bcrypt ka hashed password if matches retuns true else false aur ye time leta hai islie async await

userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
          _id: this._id,
           email:this.email,
           username:this.username,
           fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// sign method generates token
// sign method ke 3 parameters hote hai , pehla hota hai payload ki aap kya kya chahte ho include ho aur baaki dekh lena 
// and it returns a token islie use return keyword
useSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
          _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    
}
// // exactly copy paste from accesstoken but isme bas id rakhte hai aur bas secret aur expiry refresh ki kar dena



export const User = mongoose.model("User", userSchema)