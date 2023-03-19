/* 
    Predefined job names
*/

import mongoose from "mongoose";
import Specialty from "../../users/SpecialtySchema";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 10)

const JobNameSchema = new mongoose.Schema({
    jobID: {
        type: String, 
        unique: true,
        // default: nanoid()
    },
    name: {
        type: String,
        maxLength: 50,
        unique: true,
        required: true,
    },
    // Job category will be used to highlight mechanics upon JO assignment
    categoryID: {
        type: mongoose.Types.ObjectId,
        ref: "Specialty"
    },
    disabled: {
        type: Boolean, 
        default: false,
    }
})

const JobName = mongoose.models.JobName || mongoose.model("JobName", JobNameSchema)

export default JobName