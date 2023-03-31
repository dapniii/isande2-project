import { connectToDatabase } from "@/lib/db";
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import JobOrderMechanic from "@/models/jobOrders/JobOrderMechanicSchema";
import JobOrderDetails from "@/models/jobOrders/JobOrderDetailsSchema";
import JobOrderItem from "@/models/jobOrders/JobOrderItemSchema";

export default async (req, res) => {
    await connectToDatabase()

    let jobOrders = await JobOrder.find({}).sort([["lastUpdatedDate", -1]])
        .populate("vehicleID")
        .populate("statusID")

    let joMechanics = await JobOrderMechanic.find({})
        .populate({
            path: "mechanicID",
            populate: [
                {
                    path: "userID",       
                    model: "User", 
                }, 
            ]})
    let joDetails = await JobOrderDetails.find({})
        .populate("jobID")

    let joPartsList = await JobOrderItem.find({})
        .populate("itemID")

    jobOrders.map(JO => {
        let mechanics = joMechanics.filter(mech => mech.jobOrderID.toString() == JO._id.toString())
        let details = joDetails.filter(detail => detail.jobOrderID.toString() == JO._id.toString())
        let partsList = joPartsList.filter(list => list.jobOrderID.toString() == JO._id.toString())   

        JO.set("mechanics", mechanics, {strict: false})
        JO.set("details", details, {strict: false})
        JO.set("partsList", partsList, {strict: false})

    })
    
    res.json(jobOrders)
}