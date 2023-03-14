import mongoose from "mongoose";

const FuelSensorSchema = new mongoose.Schema({
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

const FuelSensor = mongoose.models.FuelSensor || mongoose.model("FuelSensor", FuelSensorSchema)


export default FuelSensor;