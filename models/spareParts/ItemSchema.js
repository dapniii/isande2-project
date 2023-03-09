import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const ItemSchema = new mongoose.Schema({
    itemNumber: {
        type: String,
        minLength: 10,
        maxLength: 10,
        unique: true,
        required: true,
        default: customAlphabet(alphanumeric, 10) // Generate random id if not specified
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemCategory",
        required: true,
    },
    itemName: {
        type: String,
        maxLength: 50,
        unique: true,
        required: true,
    },
    itemModel: {
        type: String,
        maxLength: 50
    },
    reorderPoint: {
        type: Number,
        min: 0,
        default: 0,
    },
    unitID: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Measure",
        // required: true, 
        type: String,
    },
    description: {
        type: String,
    },
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    creationDate: {
        type: Date,
        default: new Date()
    },
    disabled: {
        type: Boolean,
        default: true,
    }
})