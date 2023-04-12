import { connectToDatabase } from "@/lib/db";
import JobOrderItem from "@/models/jobOrders/JobOrderItemSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";

export default async (req, res) => {
    await connectToDatabase();

    const returnInfo = req.body
    console.log(returnInfo)

    returnInfo.map(async item => {
        if (item.new) {
            let detailID = await ItemDetails.findByIdAndUpdate(item.detailID, 
                { $inc: {quantity: item.returnQty} }
            )
            console.log(detailID)
            let joPart = await JobOrderItem.findByIdAndUpdate(item._id, 
                { $inc: {returnQty: item.returnQty} }
            )
            console.log(joPart)
        }
    })

    
    res.json("success")
}