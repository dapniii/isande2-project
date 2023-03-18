import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import Vehicle from "@/models/vehicles/VehicleSchema";

export default async (req, res) => {
    await connectToDatabase()
    var ObjectId = mongoose.Types.ObjectId

    let vehicleInfo = await Vehicle.findOne({
        plateNumber: req.query.plateNumber
    })
    .populate("imageID")
    .populate("vehicleTypeID")
    .populate("brandID")
    .populate("transmissionID")
    .populate("engineTypeID")
    .populate("chassisTypeID")
    .populate("tireSizeID")
    .populate("gpsID")
    .populate("fuelSensorID")
    .populate("vehicleStatusID")

    if (vehicleInfo == null) {
        let error = "Vehicle not found";
        console.log(`Error: ${error}`);
        res.json(error);
    } else {
        console.log(`Found vehicle ${vehicleInfo.plateNumber}`)
        res.json(vehicleInfo);
    }
}