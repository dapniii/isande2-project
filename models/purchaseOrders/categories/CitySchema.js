import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 5)

const CitySchema = new mongoose.Schema({
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
        maxLenght: 50,
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false,
    }
})

const City = mongoose.models.City || mongoose.model("City", CitySchema)

export default City;