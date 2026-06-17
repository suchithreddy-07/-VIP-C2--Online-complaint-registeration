import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({

    complaint:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complaint",
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    rating:{
        type:Number,
        min:1,
        max:5
    },

    comment:{
        type:String
    }

},{
    timestamps:true
})

const feedbackModel = mongoose.model("Feedback",feedbackSchema);
export default feedbackModel