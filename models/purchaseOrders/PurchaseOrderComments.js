import mongoose from "mongoose";
import User from "../users/UserSchema";
import PurchaseOrder from "./PurchaseOrderSchema";

const PurchaseOrderCommentSchema = new mongoose.Schema({
    poID: {
        type: mongoose.Types.ObjectId,
        ref: "PurchaseOrder"
    },
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        required: true,
    },
    commentDate: {
        type: Date,
        default: new Date()
    }
})

const PurchaseOrderComment = mongoose.models.PurchaseOrderComment || mongoose.model("PurchaseOrderComment", PurchaseOrderCommentSchema)

export default PurchaseOrderComment;