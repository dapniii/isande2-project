import mongoose from "mongoose";
import Image from "../ImageSchema";
import Department from "./DepartmentSchema";
import Role from "./RoleSchema";
import UserType from "./UserTypeSchema";

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true,
        maxLength: 8,
        minLength: 8,
    },
    imageID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
    },
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        maxLength: 50,
    },
    phone: {
        type: String,
        required: true,
        minLength: 11,
        maxLength: 11,
    },
    departmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    roleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },
    userTypeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserType",
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    creationDate: {
        type: Date,
        default: new Date(),
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User;