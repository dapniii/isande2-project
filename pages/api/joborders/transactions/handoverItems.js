import mongoose from "mongoose";
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
    const ObjectId = mongoose.Types.ObjectId
    console.log(joInfo)
    let statusID = await JobOrderStatus.findOne({name: "Open"})
    let updateJo = await JobOrder.findOneAndUpdate({jobOrderID: joInfo.jobOrderID}, {statusID: statusID._id})

    let changeStatus = true
    let data = await Promise.all(joInfo.details.partsList.map(async item => {
        let brandID = await ItemBrand.findOne({name: item.detailID.itemBrandID.name})
        let detailID = await ItemDetails.findOneAndUpdate({
            partNumber: item.detailID.partNumber,
            itemBrandID: brandID._id
        }, { $inc: {quantity: -item.receivedQty}})
        let updatePartsList = await JobOrderItem.findByIdAndUpdate(item._id, {
            detailID: detailID._id,
            receivedQty: item.receivedQty
        })

        if (updatePartsList.requestedQty != updatePartsList.receivedQty) {
            changeStatus = false
        }
    }))
    
    res.json("success")
}
