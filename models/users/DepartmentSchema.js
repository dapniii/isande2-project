import mongoose from "mongoose";
import { nanoid } from "nanoid";

const DepartmentSchema = new mongoose.Schema({
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

const Department = mongoose.models.Department || mongoose.model("Department", Department)

export default Department;