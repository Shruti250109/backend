import multer from "multer";
// this helps you handle file uploads , without it express cannot read files properly

const storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
    // sari files public folder me rakege taaki easily upload ho paye
    // .diskStorage me bata rahe ki mere computer me save karo file
    // destination wala function decides where to store the file req:requested data file: file info and cb=callback(used to confirm location)
// null means no error and public/temp means folder where file will be saved and storing in public makes it easy to upload
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
    // jo user bhi user ne original name dia tha wahi bata do ussi se rakh dege
  }
})

 export const upload = multer({ storage,

 })
// you are creating an upload middleware here
//  dont forget to export it