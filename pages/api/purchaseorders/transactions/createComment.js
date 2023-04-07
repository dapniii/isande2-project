import { connectToDatabase } from "@/lib/db";
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema";
import User from "@/models/users/UserSchema";
import PurchaseOrderComment from "@/models/purchaseOrders/PurchaseOrderComments";

export default async (req, res) => {
    await connectToDatabase();

    const commentInfo = req.body.commentInfo
    const poNumber = req.body.poNumber

    let poID = await PurchaseOrder.findOne({poNumber: poNumber})
    let creatorID = await User.findOne({userID: commentInfo.userID})

    let poComment = await PurchaseOrderComment.create({
        poID: poID._id,
        creatorID: creatorID._id,
        comment: commentInfo.commentText,
        commentDate: commentInfo.commentDate
    })

    res.json(poComment)
}