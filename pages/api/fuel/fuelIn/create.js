import { connectToDatabase } from "@/lib/db";
import FuelIn from "@/models/fuel/FuelInSchema";

export default async (req, res) => {
    await connectToDatabase();
    const fuelInInfo = req.body;

    fuelInInfo.additions.forEach(async e => {
        let duplicates = await FuelIn.find({
            $or: [ {'fuelInId': fuelInInfo.id}, {'name': fuelInInfo.name}]
        })
        await FuelIn.create({//CHECK FUEL IN - add here
            fuelInId: e.id,
            recordDateTime: e.date,
            userId: e.userId,
            liters: e.liters,
            fuelIn: e.fuelIn,
            fuelInPercent: e.fuelInPercent,
            creatorID: e.userId,
        })
    })

    res.json("success");
}