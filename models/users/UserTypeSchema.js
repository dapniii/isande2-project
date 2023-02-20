import mongoose from "mongoose";
import { nanoid } from "nanoid";

const UserTypeSchema = new mongoose.Schema({
    pubId: {
        type: String,
        unique: true,
        required: true,
        default: nanoid(15),
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

const UserType = mongoose.models.UserTypeSchema || mongoose.model("UserType", UserType)

export default UserType;