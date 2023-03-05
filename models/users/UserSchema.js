import mongoose from "mongoose";
import { nanoid } from "nanoid";

const UserSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        unique: true,
        required: true,
        default: nanoid(15),
    },
    firstName: {
        type: String,
        required: true,
        maxLenght: 50,
    },
    lastName: {
        type: String,
        required: true,
        maxLenght: 50,
    },
    email: {
        type: String,
        required: true,
        maxLenght: 50,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false,
    }
})

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User;