import mongoose from "mongoose";

const MechanicSchema = new mongoose.Schema({
  userID: {
    type: String,
    minlength: 8,
    maxlength: 8,
    unique: true,
    required: true,
  },
  specialtyID: {
    type: String,
    minlength: 5,
    maxlength: 5,
    unique: true,
    required: true,
  },

});

const Mechanic =
  mongoose.models.Mechanic || mongoose.model("Mechanic", MechanicSchema);

export default Mechanic;
