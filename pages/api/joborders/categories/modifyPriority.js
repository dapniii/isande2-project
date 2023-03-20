import { connectToDatabase } from "@/lib/db";
import JobOrderPriority from "@/models/jobOrders/categories/JobOrderPrioritySchema";

export default async (req, res) => {
    await connectToDatabase();
    const priorityInfo = req.body;

    // Insert new item brands
    priorityInfo.additions.forEach(async element => {
        let duplicates = await JobOrderPriority.find({
            $or: [ {'pubId': priorityInfo.id}, {'name': priorityInfo.name}]
            
        }) 
        await JobOrderPriority.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    priorityInfo.edits.forEach(async element => {
        let duplicates = await JobOrderPriority.findOne({
            name: element.name
        })

        let edit = await JobOrderPriority.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}