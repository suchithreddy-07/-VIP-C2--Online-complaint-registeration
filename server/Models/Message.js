import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    complaint:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complaint",
        required:true
    },

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    message:{
        type:String,
        required:true
    },

    isRead:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})

const messageModel = mongoose.model("Message",messageSchema);
export default messageModel