import mongoose from "mongoose";
import PurchaseOrder from "../PurchaseOrderSchema";
import PurchaseOrderPartsList from "../PurchaseOrderPartsListSchema";
import User from "@/models/users/UserSchema";

const PurchaseOrderReceiveSchema = new mongoose.Schema({
    poID: {
        type: mongoose.Types.ObjectId,
        ref: "PurchaseOrder"
    },
    poPartID: {
        type: mongoose.Types.ObjectId,
        ref: "PurchaseOrderPartsList"
    },
    receivedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    receivedQuantity: {
        type: Number,
        default: 0,
    }
}, {timestamps: true})

const PurchaseOrderReceive = mongoose.models.PurchaseOrderReceive || mongoose.model("PurchaseOrderReceive", PurchaseOrderReceiveSchema)

export default PurchaseOrderReceive;