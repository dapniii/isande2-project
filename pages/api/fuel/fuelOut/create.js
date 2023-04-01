import { connectToDatabase } from "@/lib/db";
import FuelOut from "@/models/fuel/FuelInSchema";

export default async (req, res) => {
    await connectToDatabase();
    const fuelOutInfo = req.body;

    fuelOutInfo.additions.forEach(async e => {
        let duplicates = await FuelOut.find({
              'fuelInId': fuelInInfo.id
        })
        await FuelOut.create({
            fuelOutID: e.id,
            recordDateTime: e.date,
            driverID:e.driverId,
            userID: e.userId,
            plateNumber: e.plateNumber,
            liters: e.liters,
            fuelOut: e.fuelOut,
            previousRoute: e.previousRoute,
            fuelOutPercent: e.fuelOutPercent,
            creatorID: e.userId,
        })
    })

    res.json("success");
}