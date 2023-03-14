import mongoose from "mongoose";

const TireSizeSchema = new mongoose.Schema({
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

const TireSize = mongoose.models.TireSize || mongoose.model("TireSize", TireSizeSchema)


export default TireSize;