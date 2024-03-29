import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/alphanumeric";

const nanoid = customAlphabet(alphanumeric, 5)
const ItemCategorySchema = new mongoose.Schema({
    pubId: {
        type: String,
        unique: true,
        required: true,
        minLenght: 5,
        default: nanoid(),
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