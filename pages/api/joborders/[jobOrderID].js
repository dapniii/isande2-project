import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import JobOrderMechanic from "@/models/jobOrders/JobOrderMechanicSchema";
import JobOrderDetails from "@/models/jobOrders/JobOrderDetailsSchema";
import JobOrderItem from "@/models/jobOrders/JobOrderItemSchema";

export default async (req, res) => {
    await connectToDatabase()

    let jobOrder = await JobOrder.findOne({
        jobOrderID: req.query.jobOrderID
    })
    .populate("vehicleID")
    .populate("statusID")
    
    let mechanics = await JobOrderMechanic.find({
        jobOrderID: jobOrder._id
    }).populate({
        path: "mechanicID",
        populate: [
            {
                path: "userID",       
                model: "User", 
            }, 
        ]})
    
    let details = await JobOrderDetails.find({
        jobOrderID: jobOrder._id
    }). populate("jobID")

    let partsList = await JobOrderItem.find({
        jobOrderID: jobOrder._id,
    }).populate("itemID")

    res.json({
        jobOrder,
        mechanics,
        details,
        partsList
    })
}