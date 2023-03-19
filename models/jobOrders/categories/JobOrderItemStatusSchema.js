/* 
    Job order item / list row statis 
*/

import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 5)

const JobOrderItemStatusSchema = new mongoose.Schema({
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
    disabled: {
        type: Boolean,
        required: true,
        default: false,
    }
})

const JobOrderItemStatus = mongoose.models.JobOrderItemStatus || mongoose.model("JobOrderItemStatus", JobOrderItemStatusSchema)

export default JobOrderItemStatus