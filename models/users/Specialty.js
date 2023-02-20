import mongoose from "mongoose";

const SpecialtySchema = new mongoose.Schema({
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

const Specialty = mongoose.models.SpecialtySchema || mongoose.model("Specialty", Specialty)

export default Specialty;