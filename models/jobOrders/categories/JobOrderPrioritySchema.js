/* 
    Job order priority names
*/

import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 5)

const JobOrderPrioritySchema = new mongoose.Schema({
    pubId: {
        type: String,
        unique: true,
        required: true,
        minLength: 5,
        default: nanoid(),
    },
    name: {
        type: String,
        unique: true,
        required: true,
        maxLength: 50,
    },
    // used for sorting
    weight: {
        type: Number,
        unique: true,
        required: true,
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false,
    }
})

const JobOrderPriority = mongoose.models.JobOrderPriority || mongoose.model("JobOrderPriority", JobOrderPrioritySchema)

export default JobOrderPriority