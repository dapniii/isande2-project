import mongoose from "mongoose";

const UserTypeSchema = new mongoose.Schema({
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