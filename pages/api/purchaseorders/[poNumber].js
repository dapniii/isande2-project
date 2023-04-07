import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema";
import PurchaseOrderPartsList from "@/models/purchaseOrders/PurchaseOrderPartsListSchema";
import PurchaseOrderComment from "@/models/purchaseOrders/PurchaseOrderComments";
import PurchaseOrderFile from "@/models/purchaseOrders/PurchaseOrderFileSchema";
import PurchaseOrderApproval from "@/models/purchaseOrders/transactions/PurchaseOrderApprovalSchema";

export default async (req, res) => {
    await connectToDatabase();

    let purchaseOrder = await PurchaseOrder.findOne({
        poNumber: req.query.poNumber
    })
    .populate("statusID")
    .populate("supplierID")
    .populate("requestedBy")

    let poItems = await PurchaseOrderPartsList.find({
        poID: purchaseOrder._id
    })
    .populate("itemID")
    .populate({
        path: "detailID",
        populate: [
            {
                path: "itemBrandID",       
                model: "ItemBrand", 
            }, 
        ]})

    let totalCost = 0.00
    poItems.map(part => {
        totalCost += parseFloat(part.unitCost)
    })

    purchaseOrder.set("partsList", poItems, {strict: false})
    purchaseOrder.set("totalCost", totalCost, {strict: false})

    let commentRes = await PurchaseOrderComment.find({})
        .populate("creatorID")

    let poComments = []
    commentRes.map(comment => {
        if (comment.poID.toString() == purchaseOrder._id.toString()) {
            poComments.push(comment)
        }
    })
    purchaseOrder.set("comments", poComments, {strict: false})

    let poApproval = await PurchaseOrderApproval.findOne({
        poID: purchaseOrder._id
    })
    .populate("approverID")

    purchaseOrder.set("approval", poApproval, {strict: false})

    res.json({purchaseOrder})
}