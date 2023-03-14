import { connectToDatabase } from "@/lib/db";
import Transmission from "@/models/vehicles/TransmissionSchema";

export default async (req, res) => {
    await connectToDatabase();
    const transmissionInfo = req.body;

    // Insert new item brands
    transmissionInfo.additions.forEach(async element => {
        let duplicates = await Transmission.find({
            $or: [ {'pubId': transmissionInfo.id}, {'name': transmissionInfo.name}]
            
        }) 
        await Transmission.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    transmissionInfo.edits.forEach(async element => {
        let duplicates = await Transmission.findOne({
            name: element.name
        })

        let edit = await Transmission.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}