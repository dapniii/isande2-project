import mongoose from "mongoose";

const PurchaseOrderActivitySchema = new mongoose.Schema({

}, {timestamps: true})

const PurchaseOrderActivity = mongoose.models.PurchaseOrderActivity || mongoose.model("PurchaseOrderActivity", PurchaseOrderActivitySchema)

export default PurchaseOrderActivity;