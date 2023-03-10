import { connectToDatabase } from "@/lib/db";
import ItemBrand from "@/models/spareParts/ItemBrandSchema";

export default async (req, res) => {
    await connectToDatabase();
    const brandInfo = req.body;

    // Insert new item brands
    brandInfo.additions.forEach(async element => {
        let duplicates = await ItemBrand.find({
            $or: [ {'pubId': brandInfo.id}, {'name': brandInfo.name}]
            
        }) 
        await ItemBrand.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    brandInfo.edits.forEach(async element => {
        let duplicates = await ItemBrand.findOne({
            name: element.name
        })

        let edit = await ItemBrand.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}