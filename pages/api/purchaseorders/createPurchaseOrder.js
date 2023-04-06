import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/db"
import PurchaseOrderStatus from "@/models/purchaseOrders/categories/PurchaseOrderStatusSchema"
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema"
import PurchaseOrderPartsList from "@/models/purchaseOrders/PurchaseOrderPartsListSchema"
import User from "@/models/users/UserSchema"
import Supplier from "@/models/purchaseOrders/categories/SupplierSchema"

export default async (req, res) => {
    await connectToDatabase()
    const ObjectId = mongoose.Types.ObjectId

    const poInfo = req.body
    console.log(poInfo)
    let requesterSplit = poInfo.requestedBy.split(" ")
    let statusID = await PurchaseOrderStatus.findOne({name: poInfo.statusID})
    let supplierID = await Supplier.findOne({name: poInfo.supplierID})
    let requestedByID = await User.find({
        firstName: requesterSplit[0],
        lastName: requesterSplit[1],
    })
    let creatorID = await User.findOne({userID: poInfo.creatorID})

    let poResult = await PurchaseOrder.create({
        poNumber: poInfo.poNumber,
        statusID: statusID._id,
        supplierID: supplierID._id,
        requestedBy: requestedByID._id,
        description: poInfo.description,
        creatorID: creatorID._id,
    })

    poInfo.partsList.map(async item => {
        let partsListRes = await PurchaseOrderPartsList.create({
            poID: poResult._id,
            itemID: ObjectId(item.itemID),
            detailID: ObjectId(item.detailID),
            unitCost: item.unitCost,
            quantity: item.quantity
        })

        // let detailsRes = await ItemDetails.findByIdAndUpdate(item.detailID,
        //     { $inc: 
        //         { quantity: item.quantity }
        //     }
        // )
    })

    res.json("success")
}