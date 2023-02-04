import mongoose from "mongoose";

const UserTypeSchema = new mongoose.Schema({
  typeID: {
    type: String,
    minlength: 5,
    maxlength: 5,
    unique: true,
    required: true,
  },
  typeName: {
    type: String,
    maxLength: 50,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserType =
  mongoose.models.UserType || mongoose.model("UserType", UserTypeSchema);

export default UserType;
