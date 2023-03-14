import { connectToDatabase } from "@/lib/db";
import VehicleType from "./VehicleTypeSchema";
import VehicleBrand from "./VehicleBrandSchema";
import Transmission from "./TransmissionSchema";
import VehicleStatus from "./VehicleStatus";
import EngineType from "./EngineTypeSchema";
import Chassis from "./ChassisSchema"
import TireSize from "./TireSizeSchema";
import GPS from "./GPSSchema";
import FuelSensor from "./FuelSensor";


export default async (req, res) => {
    await connectToDatabase();

    let vehicleTypes = await VehicleType.find({})
    let brands = await VehicleBrand.find({})
    let transmission = await Transmission.find({})
    let status = await VehicleStatus.find({})
    let engineType = await EngineType.find({})
    let chassis = await Chassis.find({})
    let tireSize = await TireSize.find({})
    let gps = await GPS.find({})
    let fuelSensor = await FuelSensor.find({})

    res.json({
        vehicleTypes,
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