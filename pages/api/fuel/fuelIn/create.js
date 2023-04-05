import { connectToDatabase } from "@/lib/db";
import FuelIn from "@/models/fuel/FuelInSchema";

export default async (req, res) => {
    try {
        await connectToDatabase();
        const e = req.body;
            
        await FuelIn.create({//CHECK FUEL IN - add here
            fuelInID: e.fuelInID,
            fRecordDateTime: e.fRecordDateTime,
            fLiters: e.fLiters,
            creatorID: e.creatorID,
            fUnitCost: e.fUnitCost,
        })
    
        res.json("success");
    } catch (err) {
        console.error(err)
    }
}
