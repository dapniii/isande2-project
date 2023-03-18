import { connectToDatabase } from "@/lib/db";
import Vehicle from "@/models/vehicles/VehicleSchema";
import Image from "@/models/ImageSchema";
import VehicleType from "@/models/vehicles/VehicleTypeSchema";
import VehicleBrand from "@/models/vehicles/VehicleBrandSchema";
import Transmission from "@/models/vehicles/TransmissionSchema";
import EngineType from "@/models/vehicles/EngineTypeSchema";
import Chassis from "@/models/vehicles/ChassisSchema";
import TireSize from "@/models/vehicles/TireSizeSchema";
import GPS from "@/models/vehicles/GPSSchema";
import FuelSensor from "@/models/vehicles/FuelSensor";
import VehicleStatus from "@/models/vehicles/VehicleStatus";
import User from "@/models/users/UserSchema";

export default async (req, res) => {
    await connectToDatabase();

    const vehicleInfo = req.body;
    let vehicleResult = ""

    let duplicate = await Vehicle.findOne({plateNumber: vehicleInfo.plateNumber})

    if (duplicate != null) {
        console.log("Duplicate Vehicle")
    } else {
        // Get creator id 
        if (vehicleInfo.creatorID != "" || vehicleInfo.creatorID != null) {
            let creatorObjID = await User.findOne({ userID: vehicleInfo.creatorID })
            vehicleInfo.creatorID = creatorObjID._id
        }
        else {
            delete vehicleInfo.creatorID
        }

        let vTypeObjId = await VehicleType.findOne({name: vehicleInfo.vehicleTypeID})
        vehicleInfo.vehicleTypeID = vTypeObjId._id

        let brandObjId = await VehicleBrand.findOne({name: vehicleInfo.brandID})
        vehicleInfo.brandID = brandObjId._id

        let transmissionObjId = await Transmission.findOne({name: vehicleInfo.transmissionID})
        vehicleInfo.transmissionID = transmissionObjId._id

        let eTypeObjId = await EngineType.findOne({name: vehicleInfo.engineTypeID})
        vehicleInfo.engineTypeID = eTypeObjId._id

        let chassisObjId = await Chassis.findOne({name: vehicleInfo.chassisTypeID})
        vehicleInfo.chassisTypeID = chassisObjId._id

        let tireObjId = await TireSize.findOne({name: vehicleInfo.tireSizeID})
        vehicleInfo.tireSizeID = tireObjId._id

        let gpsObjId = await GPS.findOne({name: vehicleInfo.gpsID})
        vehicleInfo.gpsID = gpsObjId._id

        let fuelObjId = await FuelSensor.findOne({name: vehicleInfo.fuelSensorID})
        vehicleInfo.fuelSensorID = fuelObjId._id

        let statusObjId = await VehicleStatus.findOne({name: vehicleInfo.vehicleStatusID})
        vehicleInfo.vehicleStatusID = statusObjId._id

        let imageResult = await Image.create({
            secure_url: vehicleInfo.imageID.secure_url,
            disabled: false,
        })
        vehicleInfo.imageID = imageResult._id

        vehicleInfo.insuranceExpiry = new Date(vehicleInfo.insuranceExpiry)

        vehicleResult = await Vehicle.create(vehicleInfo)
    }

    res.json({
        vehicle: vehicleResult,
        msg: "success"
    })
}