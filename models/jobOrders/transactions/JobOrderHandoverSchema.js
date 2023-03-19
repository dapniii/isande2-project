/*
    Contains audit trail for when an employee hands over requested items to the mechanic
*/

import mongoose from "mongoose";
import JobOrderItem from "../JobOrderItemSchema";
import User from "@/models/users/UserSchema";

const JobOrderHandoverSchema = new mongoose.Schema({
    jobOrderItemID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrderItem",
    },
    providedQty: {
        type: Number,
        min: 1,
        required: true,
    },
    inventoryStaffID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    receiverID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    handoverDate: {
        type: Date,
        default: new Date()
    },
})

const JobOrderHandover = mongoose.models.JobOrderHandover || mongoose.model("JobOrderHandover", JobOrderHandoverSchema)

export default JobOrderHandover