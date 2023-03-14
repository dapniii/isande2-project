import { connectToDatabase } from "@/lib/db";
import VehicleType from "@/models/vehicles/VehicleTypeSchema";

export default async (req, res) => {
    await connectToDatabase();
    const typeInfo = req.body;

    // Insert new item brands
    typeInfo.additions.forEach(async element => {
        let duplicates = await VehicleType.find({
            $or: [ {'pubId': typeInfo.id}, {'name': typeInfo.name}]
            
        }) 
        await VehicleType.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    typeInfo.edits.forEach(async element => {
        let duplicates = await VehicleType.findOne({
            name: element.name
        })

        let edit = await VehicleType.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}