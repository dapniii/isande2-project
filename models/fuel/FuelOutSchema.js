import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 15);

const FuelOutSchema = new mongoose.Schema({
    fuelOutID: {
        type: String,
        unique: true,
        required: true,
        maxLength: 15,
        minLength: 15,
        default: nanoid(),
    },
    oRecordDateTime: {
        type: Date,
        required: true,
    },
    oDriverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    oUserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    oPlateNumber: { //TO EDIT IF VEHICLES PART IS CREATED
        type: String,
        required: true
    },
    oLiters: {
        type: Number,
        required: true
    },
    oFuelOut: {
        type: String,
        required: true,
        default: "Refuel Truck"
    },
    oPreviousRoute: {
        type: String,
        required: true,
        maxLength: 50
    },
    // fuelOutPercent: { //FUEL (%)
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

const FuelOut = mongoose.models.FuelOut || mongoose.model("FuelOut", FuelOutSchema)

export default FuelOut;