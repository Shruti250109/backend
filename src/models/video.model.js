import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// import kar lia mongoose aggregate ko after installing it but before exporting it usse use karna padta hai
const videoSchema = new Schema (
    {
    videoFile :{
        type:String,
        required : true,

    },
    thumbNail:{
        type:String,
        required : true,
    },
    title:{
        type:String,
        required : true,
    },
    description:{
        type:String,
        required : true,
    },
    duration:{
        type: Number,
        required : true,
    },
    // ye bhi AWS se hi milega number me
    views:{
        type : Number,
        default : 0
    },
    isPublished:{
        type : Boolean,
        default : true
    },
    //  ispublished means ki public ko available hai ya nahi
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    }    
    },
    { 
        timestamps : true
    })
    videoSchema.plugin(mongooseAggregatePaginate)
    // Attach this functionality to my schemaaaaa ab export nahi karege

 export const Video = mongoose.modell("Video", videoSchema)   