import mongoose from "mongoose";
import PurchaseOrder from "./PurchaseOrderSchema";

const PurchaseOrderFileSchema = new mongoose.Schema({
    poID: {
        type: mongoose.Types.ObjectId,
        ref: "PurchaseOrder"
    },
    filename: {
        type: String,
    },
    secure_url: {
        type: String,
    }
}, {timestamps: true})

const PurchaseOrderFile = mongoose.models.PurchaseOrderFile || mongoose.model("PurchaseOrderFile", PurchaseOrderFileSchema)

export default PurchaseOrderFile