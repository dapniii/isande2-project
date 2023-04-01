/* 
    Contains the specified jobs in the job order
*/

import mongoose from "mongoose"
import JobName from "./descriptionItems/JobNameSchema"
import JobOrder from "./JobOrderSchema"

const JobOrderDetailsSchema = new mongoose.Schema({
    jobOrderID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrder"
    },
    jobID: {
        type: mongoose.Types.ObjectId,
        ref: "JobName"
    },

}, { timestamps: true })

const JobOrderDetails = mongoose.models.JobOrderDetails || mongoose.model("JobOrderDetails", JobOrderDetailsSchema)

export default JobOrderDetails