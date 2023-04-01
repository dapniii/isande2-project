import mongoose, { mongo } from "mongoose";
import VehicleType from "./VehicleTypeSchema";
import VehicleBrand from "./VehicleBrandSchema";
import Transmission from "./TransmissionSchema";
import VehicleStatus from "./VehicleStatus";
import EngineType from "./EngineTypeSchema";
import Chassis from "./ChassisSchema"
import TireSize from "./TireSizeSchema";
import GPS from "./GPSSchema";
import FuelSensor from "./FuelSensor";
import User from "../users/UserSchema";
import Image from "../ImageSchema";

const VehicleSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        unique: true,
        required: true,
        maxLength: 7
    },
    imageID: {
        type: mongoose.Types.ObjectId,
        ref: "Image"
    },
    vehicleTypeID: {
        type: mongoose.Types.ObjectId,
        ref: "VehicleType",
    },
    brandID: {
        type: mongoose.Types.ObjectId,
        ref: "VehicleBrand",
    },
    manufactureYear: {
        type: Number,
    },
    transmissionID: {
        type: mongoose.Types.ObjectId,
        ref: "Transmission",
    },
    model: {
        type: String,
        maxLength: 50,
    },
    engineNumber: {
        type: String
    },
    engineTypeID: {
        type: mongoose.Types.ObjectId,
        ref: "EngineType"
    },
    chassisTypeID: {
        type: mongoose.Types.ObjectId,
        ref: "Chassis"
    },
    tireSizeID: {
        type: mongoose.Types.ObjectId,
        ref: "TireSize"
    },
    insuranceAmount: {
        type: mongoose.Types.Decimal128,
    },
    insuranceExpiry: {
        type: Date,
    },
    preventive: {
        type: Number
    },
    gpsID: {
        type: mongoose.Types.ObjectId,
        ref: "GPS"
    },
    fuelSensorID: {
        type: mongoose.Types.ObjectId,
        ref: "FuelSensor"
    },
    vehicleStatusID: {
        type: mongoose.Types.ObjectId,
        ref: "VehicleStatus"
    },
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    disabled: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema)

export default Vehicle