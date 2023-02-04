import mongoose from "mongoose";

const UserRoleSchema = new mongoose.Schema({
  roleID: {
    type: String,
    minlength: 5,
    maxlength: 5,
    unique: true,
    required: true,
  },
  roleName: {
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

const UserRole =
  mongoose.models.UserRole || mongoose.model("UserRole", UserRoleSchema);

export default UserRole;
