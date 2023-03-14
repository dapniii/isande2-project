import mongoose from "mongoose";

const ItemAdjustmentReasonSchema = new mongoose.Schema({
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

const ItemAdjustmentReason = mongoose.models.ItemAdjustmentReason || mongoose.model("ItemAdjustmentReason", ItemAdjustmentReasonSchema);

export default ItemAdjustmentReason;