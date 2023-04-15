import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema";
import PurchaseOrderStatus from "@/models/purchaseOrders/categories/PurchaseOrderStatusSchema";
import PurchaseOrderPartsList from "@/models/purchaseOrders/PurchaseOrderPartsListSchema";
import User from "@/models/users/UserSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import PurchaseOrderReceive from "@/models/purchaseOrders/transactions/PurchaseOrderReceiveSchema";
import PurchaseOrderComment from "@/models/purchaseOrders/PurchaseOrderComments";

export default async (req, res) => {
    await connectToDatabase();
    const ObjectId = mongoose.Types.ObjectId;
    const poInfo = req.body;
    
    // Set status
    let statusName = "";
    if (poInfo.isComplete) statusName = "Completed";
    else if (poInfo.hasIssues) statusName = "With Issues";
    else statusName = "Received"

    console.log(statusName)
    // Get status ID
    let statusID = await PurchaseOrderStatus.findOne({name: statusName})
    // Get userID
    let receivedByID = await User.findOne({userID: poInfo.receivedBy})

    // Update PO

    if (statusName == "Completed") {
        let updatePo = await PurchaseOrder.findByIdAndUpdate(ObjectId(poInfo.poID), {
            statusID: statusID._id,
            deliveredDate: poInfo.date,
            completedDate: poInfo.date
        })
    }

    else if (statusName == "With Issues") {
        let updatePo = await PurchaseOrder.findByIdAndUpdate(ObjectId(poInfo.poID), {
            statusID: statusID._id,
            deliveredDate: poInfo.date,
            completedDate: poInfo.date
        })

        let poComment = await PurchaseOrderComment.create({
            poID: ObjectId(poInfo.poID),
            creatorID: receivedByID._id,
            comment: poInfo.issueNote,
            commentDate: poInfo.date,
        })
    }

    else {
        let updatePo = await PurchaseOrder.findByIdAndUpdate(ObjectId(poInfo.poID), {
            statusID: statusID._id,
            deliveredDate: poInfo.date,
        })
    }

    /* 
        Access parts list
            - Update PO parts list
            - Update PO receive item transaction schema
            - Update quantity in item details
    */ 
    poInfo.partsList.map(async item => {
        let poParts = await PurchaseOrderPartsList.findByIdAndUpdate(ObjectId(item._id), 
            { $inc: 
                { receivedQty: item.receivedQty }
            }
        )
        let poTransaction = await PurchaseOrderReceive.create({
            poID: ObjectId(poInfo.poID),
            poPartID: ObjectId(item._id),
            receivedBy: receivedByID._id,
            receivedQuantity: item.receivedQty,
        })

        let detailsRes = await ItemDetails.findByIdAndUpdate(ObjectId(item.detailID._id),
            { $inc: 
                { quantity: item.receivedQty }
            }
        )
    })

    res.json("success")
}