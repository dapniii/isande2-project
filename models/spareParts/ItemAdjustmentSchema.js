import mongoose from "mongoose";
import User from "../users/UserSchema";
import Item from "./ItemSchema";
import ItemDetails from "./ItemDetailsSchema";
import ItemAdjustmentReason from "./ItemAdjustmentReasonSchema";

const ItemAdjustmentSchema = new mongoose.Schema({
    itemID: {
        type: mongoose.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    itemDetailID: {
        type: mongoose.Types.ObjectId,
        ref: "ItemDetail",
    },
    reasonID: {
        type: mongoose.Types.ObjectId,
        ref: "ItemAdjustmentReason",
        required: true,
    },
    comment: {
        type: String,
    },
    newQuantity: {
        type: Number,
    },
    discrepancy: {
        type: Number,
    },
    recordDate: {
        type: Date,
        default: new Date()
    },
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
})

const ItemAdjustment = mongoose.models.ItemAdjustment || mongoose.model("ItemAdjustment", ItemAdjustmentSchema)

export default ItemAdjustment