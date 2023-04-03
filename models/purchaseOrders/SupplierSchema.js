import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50,
    },
    streetAddress: {
        type: String,
    },
    city: {
        type: String,
    },
    province: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Supplier = mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema)

export default Supplier