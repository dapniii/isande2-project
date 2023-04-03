import mongoose from "mongoose"

const PurchaseOrderStatusSchema = new mongoose.Schema({
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

const PurchaseOrderStatus = mongoose.models.PurchaseOrderStatus || mongoose.model("PurchaseOrderStatus", PurchaseOrderStatusSchema)

export default PurchaseOrderStatus;