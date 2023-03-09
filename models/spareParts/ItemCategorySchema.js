import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const ItemCategorySchema = new mongoose.Schema({
    pubId: {
        type: String,
        unique: true,
        required: true,
        minLenght: 5,
        default: customAlphabet(alphanumeric, 5),
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

const ItemCategory = mongoose.models.ItemCategory || mongoose.model("ItemCategory", ItemCategorySchema)

export default ItemCategory;