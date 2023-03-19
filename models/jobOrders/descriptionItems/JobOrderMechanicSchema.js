import mongoose from "mongoose";
import JobOrder from "../JobOrderSchema";
import Mechanic from "../../users/MechanicSchema";

const JobOrderMechanicSchema = new mongoose.Schema({
    jobOrderID: {
        type: mongoose.Types.ObjectId,
        ref: "JobOrder",
    },
    mechanicID: {
        type: mongoose.Types.ObjectId,
        ref: "Mechanic",
    },
})

const JobOrderMechanic = mongoose.models.JobOrderMechanic || mongoose.model("JobOrderMechanic", JobOrderMechanicSchema)

export default JobOrderMechanic