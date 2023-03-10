import { connectToDatabase } from "@/lib/db";
import ItemCategory from "@/models/spareParts/ItemCategorySchema";

export default async (req, res) => {
    await connectToDatabase();
    const categoryInfo = req.body;

    // Insert new item categories
    categoryInfo.additions.forEach(async element => {
        let duplicates = await ItemCategory.find({
            $or: [ {'pubId': categoryInfo.id}, {'name': categoryInfo.name}]
            
        }) 
        await ItemCategory.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item categories
    categoryInfo.edits.forEach(async element => {
        let duplicates = await ItemCategory.findOne({
            name: element.name
        })

        let edit = await ItemCategory.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}