import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    // public_id: {
    //     type: String,
    // },
    // folder: {
    //     type: String,
    // },
    // version: {
    //     type: String,
    // },
    // signature: {
    //     type: String,
    // },
    secure_url: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema)

export default Image;