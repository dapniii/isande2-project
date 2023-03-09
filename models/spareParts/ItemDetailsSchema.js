import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const ItemDetailsSchema = new mongoose.Schema({
    itemID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    itemNumber, {
        type: String,
        minLength: 10,
        maxLength: 10,
        unique: true,
        required: true,
        default: customAlphabet(alphanumeric, 10)
    },
    partNumber: {
        type: String,
        required: true,
        minLength: 10,
    },
    itemBrandID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        min: 0,
        required: true,
        default: 0
    },
    unitPrice: {
        type: Number,
        min: 0,
        required: true,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const ItemDetails = mongoose.models.ItemDetails || mongoose.model("ItemDetails", ItemDetailsSchema) 

export default ItemDetails