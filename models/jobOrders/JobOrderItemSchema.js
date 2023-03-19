/* 
    - Contains a job order's requested items
    - Data to be used in for the individual rows in parts and return list
*/

import mongoose from "mongoose";
import Item from "../spareParts/ItemSchema";
import ItemDetails from "../spareParts/ItemDetailsSchema";
import User from "../users/UserSchema";
import JobOrder from "./JobOrderSchema";
import JobOrderItemStatus from "./categories/JobOrderItemStatusSchema";

const JobOrderItemSchema = new mongoose.Schema({
    jobOrderID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrder"
    },
    // Process: Chief mechanic will specify item name and model
    itemID: {
        type: mongoose.Types.ObjectId,
        ref: "Item"
    },
    // Process: Inventory will specify part number and brand
    detailID: {
        type: mongoose.Types.ObjectId,
        ref: "ItemDetails"
    },
    itemStatusID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrderItemStatus"
    },
    requestQty: {
        type: Number,
        min: 1,
        required: true,
    },
    receivedQty: {
        type: Number,
        default: 0,
    },
    returnQty: {
        type: Number,
        default: 0,
    },
    cost: {
        type: mongoose.Types.Decimal128
    },
})

const JobOrderItem = mongoose.models.JobOrderItem || mongoose.model("JobOrderItem", JobOrderItemSchema)

export default JobOrderItem