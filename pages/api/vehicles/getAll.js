import { connectToDatabase } from "@/lib/db";
import Vehicle from "@/models/vehicles/VehicleSchema";

export default async (req, res) => {
    await connectToDatabase()

    let vehicles = await Vehicle.find({})
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

    res.json(vehicles)

}