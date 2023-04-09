import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema";
import PurchaseOrderPartsList from "@/models/purchaseOrders/PurchaseOrderPartsListSchema";
import PurchaseOrderComment from "@/models/purchaseOrders/PurchaseOrderComments";
import PurchaseOrderFile from "@/models/purchaseOrders/PurchaseOrderFileSchema";

export default async (req, res) => {
    await connectToDatabase();

    let purchaseOrders = await PurchaseOrder.find({}).sort([["updatedAt", -1]])
        .populate("statusID")
        .populate("supplierID")
        .populate("requestedBy")
    let postedCount = purchaseOrders.filter(po => po.statusID.name == "Posted").length
    let approvedCount = purchaseOrders.filter(po => po.statusID.name == "Approved").length
    let ongoingCount = purchaseOrders.filter(po => po.statusID.name == "Ongoing").length
    let purchasedCount = purchaseOrders.filter(po => po.statusID.name == "Purchased").length
    let deliveredCount = purchaseOrders.filter(po => po.statusID.name == "Delivered").length
    let withIssuesCount = purchaseOrders.filter(po => po.statusID.name == "With Issues").length

    let poItems = await PurchaseOrderPartsList.find({})
        .populate("itemID")
        .populate("detailID")

    purchaseOrders.map(PO => {
        let totalCost = 0.00
        let partsList = poItems.filter(item => item.poID.toString() == PO._id.toString())
        partsList.map(part => {
            totalCost += parseFloat(part.unitCost)
        })

        PO.set("partsList", partsList, {strict: false})
        PO.set("totalCost", totalCost, {strict: false})
    })


    res.json({
        postedCount,
        approvedCount,
        ongoingCount,
        purchasedCount,
        deliveredCount,
        withIssuesCount,
        purchaseOrders,
    })

}