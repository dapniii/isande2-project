import { connectToDatabase } from "@/lib/db";
import ItemStatus from "@/models/spareParts/ItemStatusSchema";

export default async (req, res) => {
    await connectToDatabase();
    const categoryInfo = req.body;

    // Insert new item categories
    categoryInfo.additions.forEach(async element => {
        let duplicates = await ItemStatus.find({
            $or: [ {'pubId': categoryInfo.id}, {'name': categoryInfo.name}]
            
        }) 
        await ItemStatus.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item categories
    categoryInfo.edits.forEach(async element => {
        let duplicates = await ItemStatus.findOne({
            name: element.name
        })

        let edit = await ItemStatus.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}