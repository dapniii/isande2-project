import mongoose from "mongoose";

const VehicleStatusSchema = new mongoose.Schema({
    pubId: {
        type: String,
        unique: true,
        required: true,
        minLenght: 5,
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

const VehicleStatus = mongoose.models.VehicleStatus || mongoose.model("VehicleStatus", VehicleStatusSchema)


export default VehicleStatus;