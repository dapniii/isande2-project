import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 5) 

const RefuelTypeSchema = new mongoose.Schema({
    // refuelTypeId: {
    //     type: String,
    //     unique: true,
    //     required: true,
    //     minLenght: 5,
    //     default: nanoid(),
    // },
    name: {
        type: String,
        unique: true,
        required: true,
        maxLenght: 50,
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false,
    }
})

const RefuelType = mongoose.models.RefuelType || mongoose.model("RefuelType", RefuelTypeSchema)

export default RefuelType;