import { connectToDatabase } from "@/lib/db";
import VehicleType from "@/models/vehicles/VehicleTypeSchema";
import VehicleBrand from "@/models/vehicles/VehicleBrandSchema";
import Transmission from "@/models/vehicles/TransmissionSchema";
import VehicleStatus from "@/models/vehicles/VehicleStatus";
import EngineType from "@/models/vehicles/EngineTypeSchema";
import Chassis from "@/models/vehicles/ChassisSchema";
import TireSize from "@/models/vehicles/TireSizeSchema";
import GPS from "@/models/vehicles/GPSSchema";
import FuelSensor from "@/models/vehicles/FuelSensor";

export default async (req, res) => {
    await connectToDatabase();

    let vehicleType = await VehicleType.find({})
    let brands = await VehicleBrand.find({})
    let transmission = await Transmission.find({})
    let status = await VehicleStatus.find({})
    let engineType = await EngineType.find({})
    let chassis = await Chassis.find({})
    let tireSize = await TireSize.find({})
    let gps = await GPS.find({})
    let fuelSensor = await FuelSensor.find({})

    res.json({
        vehicleType,
        brands,
        transmission,
        status,
        engineType,
        chassis,
        tireSize,
        gps,
        fuelSensor
    })
}