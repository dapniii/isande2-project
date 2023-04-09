import { connectToDatabase } from "@/lib/db";
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema";
import User from "@/models/users/UserSchema";
import ItemBrand from "@/models/spareParts/ItemBrandSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import PurchaseOrderPartsList from "@/models/purchaseOrders/PurchaseOrderPartsListSchema";
import PurchaseOrderStatus from "@/models/purchaseOrders/categories/PurchaseOrderStatusSchema";
import PurchaseOrderApproval from "@/models/purchaseOrders/transactions/PurchaseOrderApprovalSchema";
import { generateID } from "@/lib/dataHandler";

export default async (req, res) => {
    await connectToDatabase();

    const poInfo = req.body
    console.log(poInfo)
    let statusID = await PurchaseOrderStatus.findOne({name: "Approved"})
    let approverID = await User.findOne({userID: poInfo.approverID})

    let updatePo = await PurchaseOrder.findByIdAndUpdate(
        poInfo.poID, {
            statusID: statusID._id,
            approvedDate: poInfo.approvedDate,
        }
    )
    console.log(updatePo)
    
    let poApproval = await PurchaseOrderApproval.create({
        poID: poInfo.poID,
        isApproved: true,
        approverID: approverID._id,
        approvalDate: poInfo.approvedDate,
    })
    console.log(poApproval)

 

    // let updateJo = await PurchaseOrder.findOneAndUpdate({
    //     poNumber: poInfo.poNumber
    // },
    // {
    //     statusID: statusID._id,
    //     approvedDate: poInfo.approvedDate,
    // })

    // let approvalRes = await PurchaseOrderApproval.create({
    //     poID: updateJo._id,
    //     isApproved: true,
    //     approverID: approverID._id,
    //     rejectionReason: null,
    // })

    res.json("success")
}