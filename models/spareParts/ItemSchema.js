import mongoose from "mongoose";
import Image from "../ImageSchema";
import ItemCategory from "./ItemCategorySchema";
import ItemStatus from "./ItemStatusSchema";
import Measure from "../MeasureSchema";
import User from "../users/UserSchema";

const ItemSchema = new mongoose.Schema({
    itemNumber: {
        type: String,
        maxLength: 10,
        unique: true,
        required: true,
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
    eoq: {
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
    disabled: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);

export default Item;