import { connectToDatabase } from "@/lib/db";
import RefuelType from "@/models/fuel/RefuelTypeSchema";

export default async (req, res) => {
    await connectToDatabase();

    let refuelType = await RefuelType.find({})

    res.json({
        refuelType
    })
}