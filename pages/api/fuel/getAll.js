import { connectToDatabase } from "@/lib/db";
import FuelIn from "@/models/fuel/FuelInSchema";
import FuelOut from "@/models/fuel/FuelOutSchema";


export default async (req, res) => {
    await connectToDatabase();

    let fuelIn = await FuelIn.find({})
    .populate("fRecordDateTime")
    .populate("fLiters")
    .populate("fFuelInPercent")
    .populate("FUnitPrice")

    let fuelOut = await FuelOut.find({})
    .populate("oRecordDateTime")
    .populate("oLiters")
    .populate("oFuelInPercent")
    .populate("oUnitPrice")
    .populate("oPlateNumber")
    .populate("oDriverName")
    .populate("oPreviousRoute")

    //EDITTTT FROM HERE
    
    
    res.json({fuelIn, fuelOut})
}