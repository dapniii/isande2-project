/* 
    Job order status names
*/

import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 5)

const JobOrderStatusSchema = new mongoose.Schema({
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

const JobOrderStatus = mongoose.models.JobOrderStatus || mongoose.model("JobOrderStatus", JobOrderStatusSchema)

export default JobOrderStatus