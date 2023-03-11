import mongoose from "mongoose";
import Item from "./ItemSchema";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";
import { Double } from "mongodb";


const ItemDetailsSchema = new mongoose.Schema({
    itemID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    itemNumber: {
        type: String,
        minLength: 10,
        maxLength: 10,
        required: true,
    },
    partNumber: {
        type: String,
        required: true,
        minLength: 10,
    },
    itemBrandID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemBrand",
        required: true,
    },
    quantity: {
        type: Number,
        min: 0,
        required: true,
        default: 0
    },
    unitPrice: {
        type: mongoose.Types.Decimal128,
        min: 0.00,
        required: true,
        default: 0.00
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const ItemDetails = mongoose.models.ItemDetails || mongoose.model("ItemDetails", ItemDetailsSchema) 

export default ItemDetails