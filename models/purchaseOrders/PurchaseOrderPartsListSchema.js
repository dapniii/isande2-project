import mongoose from "mongoose";
import Item from "../spareParts/ItemSchema";
import ItemDetails from "../spareParts/ItemDetailsSchema";
import PurchaseOrder from "./PurchaseOrderSchema";

const PurchaseOrderPartsListSchema = new mongoose.Schema({
    poID: {
        type: mongoose.Types.ObjectId,
        ref: "PurchaseOrder"
    },
    itemID: {
        type: mongoose.Types.ObjectId,
        ref: "Item"
    },
    detailID: {
        type: mongoose.Types.ObjectId,
        ref: "ItemDetails"
    },
    unitCost: {
        type: mongoose.Types.Decimal128,
    },
    quantity: {
        type: Number,
        min: 0,
    },
    
})