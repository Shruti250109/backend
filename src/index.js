import dotenv from "dotenv"   
// It lets you use environment variables from a .env file (like PORT, DB URL, secrets).
dotenv.config()
// Loads variables from .env into process.env.

import connectDB from "./db/index.js"
// Imports your custom function that connects to database.



connectDB()
.then(()=>{
    app.listen(process.env.PORT , ()=>{
    console.log(` Server connected at PORT ${process.env.PORT}`);
    })
}).catch((error)=>{
  console.log("Connection failed !!", error);
})
// This function which is connectDb returns a Promise (very important for next step).
// then wala block tab execute hota hai jab DB connection is successful, it means jab DB sahi se connect ho jaaye tab hi server chalana hai which is app.listen
//  kaun se port pe chalana hai server? process.env.PORT pe sirf PORT pe nahi kyuki env file me likha hua sab secret hota toh congig wale function ki help se process.env me laaya jaata hai
//  catcgh block error ko pakadne ke lie hai uskde bina app silently crash kar jayega