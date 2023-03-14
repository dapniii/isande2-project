import { connectToDatabase } from "@/lib/db";
import EngineType from "@/models/vehicles/EngineTypeSchema";

export default async (req, res) => {
    await connectToDatabase();
    const engineInfo = req.body;

    // Insert new item brands
    engineInfo.additions.forEach(async element => {
        let duplicates = await EngineType.find({
            $or: [ {'pubId': engineInfo.id}, {'name': engineInfo.name}]
            
        }) 
        await EngineType.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    engineInfo.edits.forEach(async element => {
        let duplicates = await EngineType.findOne({
            name: element.name
        })

        let edit = await EngineType.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}