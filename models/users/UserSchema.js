import mongoose from "mongoose";
import { nanoid } from "nanoid";
import Image from "../ImageSchema";
import Department from "./DepartmentSchema";
import Role from "./RoleSchema";
import UserType from "./UserTypeSchema";

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true,
        default: nanoid(15),
    },
    imageID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
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
    phone: {
        type: String,
        required: true,
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
// const Image1 = mongoose.models.Image || mongoose.model("Image", ImageSchema)
// const Department1 = mongoose.models.Department || mongoose.model("Department", DepartmentSchema)
// const Role1 = mongoose.models.Role || mongoose.model("Role", RoleSchema)
// const UserType1 = mongoose.models.UserType || mongoose.model("UserType", UserTypeSchema)

export default User;