import mongoose from "mongoose";

const UserImageSchema = new mongoose.Schema({
  userID: {
    type: String,
    minlength: 8,
    maxlength: 8,
    unique: true,
    required: true,
  },
  userImg: {
    type: File,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserImage =
  mongoose.models.UserImage || mongoose.model("UserImage", UserImageSchema);

export default UserImage;
