import { connectToDatabase } from "@/lib/db";
import ItemAdjustmentReason from "@/models/spareParts/ItemAdjustmentReasonSchema";

export default async (req, res) => {
    await connectToDatabase();
    const reasonInfo = req.body

    // Insert new 
    reasonInfo.additions.forEach(async element => {
        let duplicates = await ItemAdjustmentReason.find({
            $or: [ {'pubId': reasonInfo.id}, {'name': reasonInfo.name}]
            
        }) 
        await ItemAdjustmentReason.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
        
        
    })

    // Update existing 
    reasonInfo.edits.forEach(async element => {
        let duplicates = await ItemAdjustmentReason.findOne({
            name: element.name
        })

        let edit = await ItemAdjustmentReason.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}

