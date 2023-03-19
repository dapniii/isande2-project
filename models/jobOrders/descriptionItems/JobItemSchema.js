/*  
    Contains details for a predefined job
*/

import mongoose from "mongoose";
import Item from "@/models/spareParts/ItemSchema";
import JobName from "./JobNameSchema";

const JobItemSchema = new mongoose.Schema({
    jobID: {
        type: mongoose.Types.ObjectId,
        ref: "JobName"
    },
    itemID: {
        type: mongoose.Types.ObjectId,
        ref: "Item",
    },
    recommendedQty: {
        type: Number,
        default: 1,
    },
    description: {
        type: String,
    }
})

const JobItem = mongoose.models.JobItem || mongoose.model("JobItem", JobItemSchema)

export default JobItem