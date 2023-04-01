/*
    Identifcation data of a job order
*/

import mongoose from "mongoose";
import User from "../users/UserSchema";
import Vehicle from "../vehicles/VehicleSchema";
import JobOrderStatus from "./categories/JobOrderStatusSchema";


const JobOrderSchema = new mongoose.Schema({
    jobOrderID: {
        type: String,
        minLength: 10, 
        unique: true,
        required: true,
    },
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
    disabled: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

const JobOrder = mongoose.models.JobOrder || mongoose.model("JobOrder", JobOrderSchema)

export default JobOrder