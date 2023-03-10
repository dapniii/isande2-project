import mongoose from "mongoose";
import Image from "../ImageSchema";
import ItemCategory from "./ItemCategorySchema";
import Measure from "../MeasureSchema";
import User from "../users/UserSchema";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 10)

const ItemSchema = new mongoose.Schema({
    itemNumber: {
        type: String,
        minLength: 10,
        maxLength: 10,
        unique: true,
        required: true,
        default: nanoid() // Generate random id if not specified
    },
    imageID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Measure",
        required: true, 
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
        default: false,
    }
})

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);

export default Item;