import { connectToDatabase } from "@/lib/db";
import PurchaseOrderStatus from "@/models/purchaseOrders/categories/PurchaseOrderStatusSchema";

export default async (req, res) => {
    await connectToDatabase();
    const statusInfo = req.body;

    // Insert new item brands
    statusInfo.additions.forEach(async element => {
        let duplicates = await PurchaseOrderStatus.find({
            $or: [ {'pubId': statusInfo.id}, {'name': statusInfo.name}]
            
        }) 
        await PurchaseOrderStatus.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    statusInfo.edits.forEach(async element => {
        let duplicates = await PurchaseOrderStatus.findOne({
            name: element.name
        })

        let edit = await PurchaseOrderStatus.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}