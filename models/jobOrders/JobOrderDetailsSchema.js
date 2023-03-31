/* 
    Contains the specified jobs in the job order
*/

import mongoose from "mongoose"
import JobName from "./descriptionItems/JobNameSchema"
import JobOrder from "./JobOrderSchema"

const JobOrderDetailsSchema = {
    jobOrderID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrder"
    },
    jobID: {
        type: mongoose.Types.ObjectId,
        ref: "JobName"
    },
    recordDate: {
        type: Date,
        default: new Date()
    }
}

const JobOrderDetails = mongoose.models.JobOrderDetails || mongoose.model("JobOrderDetails", JobOrderDetailsSchema)

export default JobOrderDetails