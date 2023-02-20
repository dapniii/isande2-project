import mongoose from "mongoose";
import { nanoid } from "nanoid";

const RoleSchema = new mongoose.Schema({
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

const Role = mongoose.models.Role || mongoose.model("Role", Role)

export default Role;