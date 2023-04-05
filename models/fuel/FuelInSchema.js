import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";
import '../users/UserSchema'

const nanoid = customAlphabet(alphanumeric, 15);

const FuelInSchema = new mongoose.Schema({
    fuelInID: {
        type: String,
        unique: true,
        required: true,
        maxLength: 15,
        minLength: 15,
        default: nanoid(),
    },
    fRecordDateTime: {
        type: Date,
        required: true,
    },
    fUnitCost: {
        type: Number,
        required: true,
    },
    fLiters: {
        type: Number,
        required: true
    },
    creatorID: {
        type: String,
        ref: "User",
    },
    creationDate: {
        type: Date,
        default: new Date(),
    },
    disabled: {
        type: Boolean,
        default: false,
    }
});

const FuelIn = mongoose.models.FuelIn || mongoose.model("FuelIn", FuelInSchema)

export default FuelIn;