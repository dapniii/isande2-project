import { connectToDatabase } from "@/lib/db";
import City from "@/models/purchaseOrders/categories/CitySchema";

export default async (req, res) => {
    await connectToDatabase();
    const cityInfo = req.body;

    // Insert new item brands
    cityInfo.additions.forEach(async element => {
        let duplicates = await City.find({
            $or: [ {'pubId': cityInfo.id}, {'name': cityInfo.name}]
            
        }) 
        await City.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    cityInfo.edits.forEach(async element => {
        let duplicates = await City.findOne({
            name: element.name
        })

        let edit = await City.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}