import { connectToDatabase } from "@/lib/db";
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema";
import PurchaseOrderStatus from "@/models/purchaseOrders/categories/PurchaseOrderStatusSchema";
import PurchaseOrderApproval from "@/models/purchaseOrders/transactions/PurchaseOrderApprovalSchema";
import PurchaseOrderActivity from "@/models/purchaseOrders/transactions/PurchaseOrderActivity";
import User from "@/models/users/UserSchema";

export default async (req, res) => {
    await connectToDatabase();

    const poInfo = req.body

    let statusID = await PurchaseOrderStatus.findOne({name: "Approved"})
    let approverID = await User.findOne({userID: poInfo.approverID})

    let updateJo = await PurchaseOrder.findOneAndUpdate({
        poNumber: poInfo.poNumber
    },
    {
        statusID: statusID._id,
    })

    let approvalRes = await PurchaseOrderApproval.create({
        poID: updateJo._id,
        isApproved: true,
        approverID: approverID._id,
        rejectionReason: null,
    })

    res.json("success")
}