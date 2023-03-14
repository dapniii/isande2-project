import { connectToDatabase } from "@/lib/db";
import TireSize from "@/models/vehicles/TireSizeSchema";

export default async (req, res) => {
    await connectToDatabase();
    const tireInfo = req.body;

    // Insert new item brands
    tireInfo.additions.forEach(async element => {
        let duplicates = await TireSize.find({
            $or: [ {'pubId': tireInfo.id}, {'name': tireInfo.name}]
            
        }) 
        await TireSize.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    tireInfo.edits.forEach(async element => {
        let duplicates = await TireSize.findOne({
            name: element.name
        })

        let edit = await TireSize.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}