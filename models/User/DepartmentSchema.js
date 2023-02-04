import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  departmentID: {
    type: String,
    minlength: 5,
    maxlength: 5,
    unique: true,
    required: true,
  },
  departmentName: {
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

const Department =
  mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

export default Department;
