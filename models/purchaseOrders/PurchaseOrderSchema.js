import mongoose from "mongoose";
import Supplier from "./SupplierSchema";
import User from "../users/UserSchema";
import PurchaseOrderStatus from "./PurchaseOrderStatusSchema";

const PurchaseOrderSchema = new mongoose.Schema({
    poNumber: {
        type: String,
        minLength: 10,
        unique: true,
        required: true,
    },
    statusID: {
        type: mongoose.Types.ObjectId,
        ref: "PurchaseOrderStatus"
    },
    supplierID: {
        type: mongoose.Types.ObjectId,
        ref: "Supplier"
    },
    requestedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
    },
}, {timestamps: true})

const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", PurchaseOrderSchema)

export default PurchaseOrder;