/* 
    Contains audit trail for returned items in a job order
*/

import mongoose from "mongoose";
import JobOrderItem from "../JobOrderItemSchema";
import User from "../../users/UserSchema";

const JobOrderReturnSchema = {
    jobOrderItemID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrderItem"
    },
    returnQty: {
        type: Number,
        min: 1,
        required: true,
    },
    // Mechanic
    returneeID: { 
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    // Inventory Staff
    receiverID: {
        type: mongoose.Types.ObjectId,
        ref: "User"    
    },
    returnDate: {
        type: Date,
        default: new Date()
    },
}

const JobOrderReturn = mongoose.models.JobOrderReturn || mongoose.model("JobOrderReturn", JobOrderReturnSchema)

export default JobOrderReturn