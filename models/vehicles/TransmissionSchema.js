import mongoose from "mongoose";

const TransmissionSchema = new mongoose.Schema({
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

const Transmission = mongoose.models.Transmission || mongoose.model("Transmission", TransmissionSchema)


export default Transmission;