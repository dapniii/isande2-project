import { connectToDatabase } from "@/lib/db";
import Measure from "@/models/MeasureSchema";

export default async (req, res) => {
    await connectToDatabase();
    const measureInfo = req.body;

    // Insert new item categories
    measureInfo.additions.forEach(async element => {
        let duplicates = await Measure.find({
            $or: [ {'pubId': measureInfo.id}, {'name': measureInfo.name}]
            
        }) 
        await Measure.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item categories
    measureInfo.edits.forEach(async element => {
        let duplicates = await Measure.findOne({
            name: element.name
        })

        let edit = await Measure.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}