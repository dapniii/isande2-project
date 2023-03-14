import { connectToDatabase } from "@/lib/db";
import VehicleBrand from "@/models/vehicles/VehicleBrandSchema";

export default async (req, res) => {
    await connectToDatabase();
    const brandInfo = req.body;

    // Insert new item brands
    brandInfo.additions.forEach(async element => {
        let duplicates = await VehicleBrand.find({
            $or: [ {'pubId': brandInfo.id}, {'name': brandInfo.name}]
            
        }) 
        await VehicleBrand.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    brandInfo.edits.forEach(async element => {
        let duplicates = await VehicleBrand.findOne({
            name: element.name
        })

        let edit = await VehicleBrand.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}