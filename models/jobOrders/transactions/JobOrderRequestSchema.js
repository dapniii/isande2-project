/* 
    Contains audit trail of additional item requests for a job order
*/

import mongoose from "mongoose";
import JobOrderItem from "../JobOrderItemSchema";
import User from "../../users/UserSchema";

const JobOrderRequestSchema = new mongoose.Schema({
    jobOrderItemID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrderItem"
    },
    requestedQty: {
        type: Number,
        min: 1,
        required: true,
    },
    requesterID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    requestDate: {
        type: Date,
        default: new Date()
    },
    requestReason: {
        type: String,
        maxLength: 50,
    },
    approved: {
        type: Boolean,
    },
    approverID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    approvedDate: {
        type: Date,
    },
    rejectionReason: {
        type: String,
        default: "",
    }
})

const JobOrderRequest = mongoose.models.JobOrderRequest || mongoose.model("JobOrderRequest", JobOrderRequestSchema)

export default JobOrderRequest

