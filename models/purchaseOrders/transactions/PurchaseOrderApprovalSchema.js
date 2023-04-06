import mongoose from "mongoose";
import PurchaseOrder from "../PurchaseOrderSchema";
import User from "@/models/users/UserSchema";

const PurchaseOrderApprovalSchema = new mongoose.Schema({
    poID: {
        type: mongoose.Types.ObjectId,
        ref: "PurchaseOrder"
    },
    isApproved: {
        type: Boolean,
        default: true,
    },
    approverID: {
        type: mongoose.Types.ObjectId,
        ref: "User"    
    },
    approvalDate: {
        type: Date,
        default: new Date()
    },
    rejectionReason: {
        type: String,
    },
}, {timestamps: true})

const PurchaseOrderApproval = mongoose.models.PurchaseOrderApproval || mongoose.model("PurchaseOrderApproval", PurchaseOrderApprovalSchema)

export default PurchaseOrderApproval;