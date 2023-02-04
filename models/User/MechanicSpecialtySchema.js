import mongoose from "mongoose";

const MechanicSpecialtySchema = new mongoose.Schema({
  specialtyID: {
    type: String,
    minlength: 5,
    maxlength: 5,
    unique: true,
    required: true,
  },
  specialtyName: {
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

const MechanicSpecialty =
  mongoose.models.MechanicSpecialty || mongoose.model("MechanicSpecialty", MechanicSpecialtySchema);

export default MechanicSpecialty;
