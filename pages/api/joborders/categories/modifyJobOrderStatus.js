import { connectToDatabase } from "@/lib/db";
import JobOrderStatus from "@/models/jobOrders/categories/JobOrderStatusSchema";

export default async (req, res) => {
    await connectToDatabase();
    const statusInfo = req.body;

    // Insert new item brands
    statusInfo.additions.forEach(async element => {
        let duplicates = await JobOrderStatus.find({
            $or: [ {'pubId': statusInfo.id}, {'name': statusInfo.name}]
            
        }) 
        await JobOrderStatus.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    statusInfo.edits.forEach(async element => {
        let duplicates = await JobOrderStatus.findOne({
            name: element.name
        })

        let edit = await JobOrderStatus.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}