import { connectToDatabase } from "@/lib/db";
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import JobOrderStatus from "@/models/jobOrders/categories/JobOrderStatusSchema";
import JobOrderApproval from "@/models/jobOrders/transactions/JobOrderApprovalSchema";
import JobOrderActivity from "@/models/jobOrders/transactions/JobOrderActivitySchema";
import User from "@/models/users/UserSchema";

export default async (req, res) => {
    await connectToDatabase()

    const joInfo = req.body

    let statusID = await JobOrderStatus.findOne({name: "Complete"})
    let approverID = await User.findOne({userID: joInfo.mechanicID})

    let updateJo = await JobOrder.findOneAndUpdate({jobOrderID: joInfo.jobOrderID}, {
        statusID: statusID._id,
        approvedDate: new Date(),
        approverID: approverID._id
    })

    res.json("success")
}