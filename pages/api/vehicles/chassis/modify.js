import { connectToDatabase } from "@/lib/db";
import Chassis from "@/models/vehicles/ChassisSchema";

export default async (req, res) => {
    await connectToDatabase();
    const chassisInfo = req.body;

    // Insert new item brands
    chassisInfo.additions.forEach(async element => {
        let duplicates = await Chassis.find({
            $or: [ {'pubId': chassisInfo.id}, {'name': chassisInfo.name}]
            
        }) 
        await Chassis.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    chassisInfo.edits.forEach(async element => {
        let duplicates = await Chassis.findOne({
            name: element.name
        })

        let edit = await Chassis.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}