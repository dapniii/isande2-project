import mongoose from "mongoose";
import User from "@/models/users/UserSchema";
import Image from "@/models/ImageSchema";
import City from "./CitySchema";
import Province from "./ProvinceSchema";

const SupplierSchema = new mongoose.Schema({
    imageID: {
        type: mongoose.Types.ObjectId,
        ref: "Image"
    },
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50,
    },
    streetAddress: {
        type: String,
    },
    cityID: {
        type: mongoose.Types.ObjectId,
        ref: "City"
    },
    provinceID: {
        type: mongoose.Types.ObjectId,
        ref: "Province"
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    disabled: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

const Supplier = mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema)

export default Supplier