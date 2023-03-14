import mongoose from "mongoose";

const VehicleBrandSchema = new mongoose.Schema({
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

const VehicleBrand = mongoose.models.VehicleBrand || mongoose.model("VehicleBrand", VehicleBrandSchema)


export default VehicleBrand;