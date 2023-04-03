/*
    Contains audit trail for when a mechanic requests for a job order review
*/

import mongoose from "mongoose";
import JobOrder from "../JobOrderSchema";
import User from "@/models/users/UserSchema";
import Mechanic from "@/models/users/MechanicSchema";

const JobOrderApprovalSchema = new mongoose.Schema({
    jobOrderID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrder",
    },
    mechanicID: {
        type: mongoose.Types.ObjectId,
        ref: "Mechanic",
    },
    reviewRequestDate: {
        type: Date
    },
    approvalStatus: {
        type: Boolean,
        default: false,
    },
    approverID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    approvalDate: {
        type: Date
    },
    rejectionReason: {
        type: String,
    }
})

const JobOrderApproval = mongoose.models.JobOrderApproval || mongoose.model("JobOrderApproval", JobOrderApprovalSchema)

export default JobOrderApproval