import { connectToDatabase } from "@/lib/db";
import FuelSensor from "@/models/vehicles/FuelSensor";

export default async (req, res) => {
    await connectToDatabase();
    const sensorInfo = req.body;

    // Insert new item brands
    sensorInfo.additions.forEach(async element => {
        let duplicates = await FuelSensor.find({
            $or: [ {'pubId': sensorInfo.id}, {'name': sensorInfo.name}]
            
        }) 
        await FuelSensor.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    sensorInfo.edits.forEach(async element => {
        let duplicates = await FuelSensor.findOne({
            name: element.name
        })

        let edit = await FuelSensor.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}