import mongoose from "mongoose";
import JobOrder from "../JobOrderSchema";
import JobOrderRequest from "./JobOrderRequestSchema";
import JobOrderHandover from "./JobOrderHandoverSchema";
import JobOrderReturn from "./JobOrderReturnSchema";

const JobOrderActivitySchema = new mongoose.Schema({
    jobOrderID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrder",
        required: true
    },
    activity: { // will automatically generated by the system from the apis
        type: String,
        required: true
    },
    requestRef: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrderRequest",
        default: null,
    },
    handOverRef: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrderHandover",
        default: null,
    },
    returnRef: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrderReturn",
        default: null,
    },
    recordDate: {
        type: Date,
        default: new Date()
    }
})

const JobOrderActivity = mongoose.models.JobOrderActivity || mongoose.model("JobOrderActivity", JobOrderActivitySchema)

export default JobOrderActivity