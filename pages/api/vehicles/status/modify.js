import { connectToDatabase } from "@/lib/db";
import VehicleStatus from "@/models/vehicles/VehicleStatus";

export default async (req, res) => {
    await connectToDatabase();
    const statusInfo = req.body;

    // Insert new item brands
    statusInfo.additions.forEach(async element => {
        let duplicates = await VehicleStatus.find({
            $or: [ {'pubId': statusInfo.id}, {'name': statusInfo.name}]
            
        }) 
        await VehicleStatus.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    statusInfo.edits.forEach(async element => {
        let duplicates = await VehicleStatus.findOne({
            name: element.name
        })

        let edit = await VehicleStatus.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}