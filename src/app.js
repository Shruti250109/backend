import express from "express"

import cors from "cors"
// Allows your backend to accept requests from another origin (like frontend).like front port 3000 pr run kar raha aur backend 5000 pe then without cors it gets blocked

import cookieParser from "cookie-parser"
// Helps you read cookies from requests. It converts cookies into a clean object since express se cookies messy aati hai , cookies are mainly used to remember user
 
const app= express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))
// Applies CORS middleware with configuration.
// origin wla part means Only allows requests from this frontend URL but yk ki CORS_ORIGIN= * dia hai .env file me means ki kahi se bhi request chalegi abhi ke lie
//  credentials wala part means Allows cookies, authentication headers
app.use(cookieParser())
app.use ( express.json ({limit : "16kb"}))
// kitna json data accept karega server , aise infinity data dege toh crash kar jaega server
app.use (express.urlencoded(
    { extended: true,
    limit:"16kb"
}))
//  express,urlencoded ek middleware hai jo ki helps your server read data sent from forms (like HTML forms) kyuki frontend me data URL ke form me aata hai
// extended allows  complex/nested data like object ke andar object jaisa data aur limit is used to limit the incoming data
app.use (express.static("public"))
// Anyone can directly access these files using a link (URL) like server running on localhost:5000 the localhasot:5000/image.jnp wagera can be used to access image uske lie code nahi likhna padega


// routes
import userRouter from './routes/user.routes.js'
// router ki jagah userRouter likh de rahe kyuki router default me xport hua tha

 
// routes declaration
app.use("/api/v1/users", userRouter) 

//  user ne likha /users tohcontrol jaega userRouter pe 

export {app}