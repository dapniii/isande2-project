import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userID: {
    type: String,
    minlength: 8,
    maxlength: 8,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    maxLength: 50,
    required: true,
  },
  lastName: {
    type: String,
    maxLength: 50,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    maxLength: 10,
    required: true,
  },
  roleID: {
    type: String,
    minlength: 5,
    maxlength: 5,
    required: true,
  },
  typeID: {
    type: String,
    minlength: 5,
    maxlength: 5,
    required: true,
  },
  departmentID: {
    type: String,
    minlength: 5,
    maxlength: 5,
    required: true,
  },
  creatorID: {
    type: String,
    minlength: 8,
    maxlength: 8,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
