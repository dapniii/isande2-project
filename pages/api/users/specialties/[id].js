import { connectToDatabase } from "@/lib/db";
import Specialty from "@/models/users/SpecialtySchema";

export default async (req, res) => {
    await connectToDatabase();

    let specialtyInfo = await Specialty.findOne({
        pubId: req.query.id,
    });

    if (specialtyInfo == null) {
        let error = "Specialty not found";
        console.log(`Error: ${error}`);
        res.json(error);
    } else {
        console.log(`Found specialty ${specialtyInfo.name}`)
        res.json(specialtyInfo);
    }
}