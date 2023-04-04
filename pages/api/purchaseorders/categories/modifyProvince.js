import { connectToDatabase } from "@/lib/db";
import Province from "@/models/purchaseOrders/categories/ProvinceSchema";

export default async (req, res) => {
    await connectToDatabase();
    const provinceInfo = req.body;

    // Insert new item brands
    provinceInfo.additions.forEach(async element => {
        let duplicates = await Province.find({
            $or: [ {'pubId': provinceInfo.id}, {'name': provinceInfo.name}]
            
        }) 
        await Province.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    provinceInfo.edits.forEach(async element => {
        let duplicates = await Province.findOne({
            name: element.name
        })

        let edit = await Province.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}