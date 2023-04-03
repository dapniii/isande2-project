import { connectToDatabase } from "@/lib/db";
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import JobOrderItem from "@/models/jobOrders/JobOrderItemSchema";
import JobOrderHandover from "@/models/jobOrders/transactions/JobOrderHandoverSchema";
import JobOrderActivity from "@/models/jobOrders/transactions/JobOrderActivitySchema";
import JobOrderStatus from "@/models/jobOrders/categories/JobOrderStatusSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import ItemBrand from "@/models/spareParts/ItemBrandSchema";

export default async (req, res) => {
    await connectToDatabase()

    const joInfo = req.body 
    console.log(joInfo.details.partsList)
    let statusID = await JobOrderStatus.findOne({name: "Open"})
    let updateJo = await JobOrder.findOneAndUpdate({jobOrderID: joInfo.jobOrderID}, {
        statusID: statusID._id
    })
    joInfo.details.partsList.map(async item => {
        let brandID = await ItemBrand.findOne({name: item.detailID.itemBrandID.name})
        let detailID = await ItemDetails.findOneAndUpdate({
            partNumber: item.detailID.partNumber,
            itemBrandID: brandID._id
        }, { $inc: {quantity: -item.receivedQty}})
        let updatePartsList = await JobOrderItem.findOneAndUpdate({
            jobOrderID: updateJo._id,
            itemID: item.itemID._id
        }, {
            detailID: detailID._id,
            receivedQty: item.receivedQty
        })
    }) 
    
    res.json("success")
}
