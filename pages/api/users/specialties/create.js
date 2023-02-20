import { connectToDatabase } from "@/lib/db";
import Specialty from "@/models/users/Specialty";

export default async (req, res) => {
    await connectToDatabase();
    const specialtyInfo = req.body;

    let duplicateID = await Specialty.findOne({
        pubId: specialtyInfo.id,
    })
    let duplicateName = await Specialty.findOne({
        name: specialtyInfo.name,
    })

    if (duplicateName != null || duplicateID != null) {
        res.json(specialtyInfo.name)
    } else {
        await Specialty.create(specialtyInfo);
        res.json("New mechanic specialty created")
    }
}