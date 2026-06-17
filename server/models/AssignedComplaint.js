import mongoose from "mongoose";

const assignedComplaintSchema = new mongoose.Schema({

    complaint:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complaint",
        required:true
    },

    agent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    assignedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    assignedAt:{
        type:Date,
        default:Date.now
    },

    status:{
        type:String,
        default:"ASSIGNED"
    }

},{
    timestamps:true
})

const assignedComplaintModel = mongoose.model("AssignedComplaint",assignedComplaintSchema);
export default assignedComplaintModel