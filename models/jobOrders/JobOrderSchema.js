/*
    Identifcation data of a job order
*/

import mongoose from "mongoose";
import JobOrderStatus from "./JobOrderStatusSchema";
import User from "../users/UserSchema";
import Vehicle from "../vehicles/VehicleSchema";

const JobOrderSchema = new mongoose.Schema({
    vehicleID: {
        type: mongoose.Types.ObjectId,
        ref: "Vehicle",
        required: true,
    },
    statusID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrderStatus"
    },
    description: {
        type: String,
    },
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    creationDate: {
        type: Date,
        default: new Date()
    },
    isTemplate: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const JobOrder = mongoose.models.JobOrder || mongoose.model("JobOrder", JobOrderSchema)

export default JobOrder