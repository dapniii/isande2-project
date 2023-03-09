import mongoose from "mongoose";
import User from "./UserSchema";
import Specialty from "./SpecialtySchema";

const MechanicSchema =  new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    specialtyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specialty",
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const Mechanic = mongoose.models.Mechanic || mongoose.model("Mechanic", MechanicSchema)

export default Mechanic;