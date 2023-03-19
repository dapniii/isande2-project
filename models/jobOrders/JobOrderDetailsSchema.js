/* 
    Contains the specified jobs in the job order
*/

import mongoose from "mongoose"
import JobItem from "./descriptionItems/JobItemSchema"
import JobOrder from "./JobOrderSchema"

const JobOrderDetailsSchema = {
    jobOrderID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrder"
    },
    jobID: {
        type: mongoose.Types.ObjectId,
        ref: "JobItem"
    }
}

const JobOrderDetails = mongoose.models.JobOrderDetails || mongoose.model("JobOrderDetails", JobOrderDetailsSchema)

export default JobOrderDetails