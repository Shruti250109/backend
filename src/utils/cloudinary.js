import { v2 as cloudinary } from 'cloudinary'
// cloundinary upload karta hai file from local storage to the server and upload ho gayi server pe tab server ko need nhi ab uski toh we have to remove it using unlink of file system
import fs from "fs"
// file system whiuch helps to read, write or do anything with file

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});
// ye saari cheeze sensitive hai toh doosre naam se env file me rakhna hoga aur sabko phir process.env karke naam chage kar dia
const uploadOnCloudinary= async (localFilePath )=>{
    try {
        if(!localFilePath) return null;
        // else upload file on cloudinary
         const response= await cloudinary.uploader.upload( localFilePath,
            {
                resource_type: "auto"
                // kon se type ki file hai ye khud dekh lena
            }
        );
          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        // file uploaded successfully
        console.log("file uploaded on cloudinary",response.url);

        return response;
    }catch(error){
      if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    //   remove the locally stored temporary file as the upload operation got failed
    return null;
    }
}
export {uploadOnCloudinary};