import mongoose from "mongoose";
import Supplier from "./categories/SupplierSchema";
import User from "../users/UserSchema";
import PurchaseOrderStatus from "./categories/PurchaseOrderStatusSchema";

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
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    // Most recent approval date
    approvedDate: {
        type: Date,
    },
    // Only one purchased date
    purchasedDate: {
        type: Date,
    },
    purchasedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    // Most recent delivered date
    deliveredDate: {
        type: Date,
    },
    completedDate: {
        type: Date,
    },
}, {timestamps: true})

const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", PurchaseOrderSchema)

export default PurchaseOrder;