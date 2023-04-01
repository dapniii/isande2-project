import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 8);

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
    fFuelIn: {
        type: Boolean,
        required: true,
        default: true
    },
    // fFuelInPercent: { //FUEL(%)
    //     type: Number,
    //     required: true
    // },
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
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

const FuelIn = mongoose.models.FuelInSchema || mongoose.model("FuelIn", FuelInSchema)

export default FuelIn;