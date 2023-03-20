import { connectToDatabase } from "@/lib/db";
import JobOrderItemStatus from "@/models/jobOrders/categories/JobOrderItemStatusSchema";

export default async (req, res) => {
    await connectToDatabase();
    const jobInfo = req.body;

    // Insert new item brands
    jobInfo.additions.forEach(async element => {
        let duplicates = await JobOrderItemStatus.find({
            $or: [ {'pubId': jobInfo.id}, {'name': jobInfo.name}]
            
        }) 
        await Job.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    jobInfo.edits.forEach(async element => {
        let duplicates = await JobOrderItemStatus.findOne({
            name: element.name
        })

        let edit = await JobOrderItemStatus.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}