import { connectToDatabase } from "@/lib/db";
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import JobOrderStatus from "@/models/jobOrders/categories/JobOrderStatusSchema";
import JobOrderApproval from "@/models/jobOrders/transactions/JobOrderApprovalSchema";
import JobOrderActivity from "@/models/jobOrders/transactions/JobOrderActivitySchema";

export default async (req, res) => {
    await connectToDatabase()

    const joInfo = req.body

    let statusID = await JobOrderStatus.findOne({name: "For Review"})
    let updateJo = await JobOrder.findOneAndUpdate({jobOrderID: joInfo.jobOrderID}, {
        statusID: statusID._id,
        completedDate: new Date()
    })

    res.json("success")
}