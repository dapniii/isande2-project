import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

// Job Order 
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import JobOrderStatus from "@/models/jobOrders/categories/JobOrderStatusSchema";
import User from "@/models/users/UserSchema";
import Vehicle from "@/models/vehicles/VehicleSchema";

// Mechanics and Details
    // Query here
import Mechanic from "@/models/users/MechanicSchema";
import JobName from "@/models/jobOrders/descriptionItems/JobNameSchema";
import JobItem from "@/models/jobOrders/descriptionItems/JobItemSchema";
    // Store here
import JobOrderMechanic from "@/models/jobOrders/JobOrderMechanicSchema";
import JobOrderDetails from "@/models/jobOrders/JobOrderDetailsSchema";

// Parts List
    // Query details here
import Item from "@/models/spareParts/ItemSchema";
import ItemDetails from "@/pages/parts/[itemNumber]";
import JobOrderItemStatus from "@/models/jobOrders/categories/JobOrderItemStatusSchema";
    // Store here
import JobOrderItem from "@/models/jobOrders/JobOrderItemSchema";

// Initial Transaction
import JobOrderRequest from "@/models/jobOrders/transactions/JobOrderRequestSchema";

export default async (req, res) => {
    await connectToDatabase()
    const joInfo = req.body

    // Get vehicle
    let vehicleID = await Vehicle.findOne({
        plateNumber: joInfo.plateNumber
    })
    if (vehicleID == null)
        res.status(404).json({ error: "Vehicle not found" })

    // Get job order status
    let statusID = await JobOrderStatus.findOne({
        name: joInfo.status
    })
    if (statusID == null)
        res.status(404).json({ error: "Status type not found"})
    
    // Get creator
    let creatorID = User.findOne({
        userID: joInfo.creatorID
    })

    // Store jo info in JobOrderSchema
    let joResult = await JobOrder.create({
        vehicleID: vehicleID._id,
        statusID: statusID._id,
        description: joInfo.description,
        // creatorID: creatorID._id,
        // isTemplate: joInfo.isTemplate,
    })
    if (joResult == null)
        res.status(500).json({ error: "Job order creation failed" })

    let assignedMech = []
    joInfo.mechanics.map(async element => {
        let userResult = await User.findOne({
            userID: element.userID
        })
        if (userResult == null) {
            res.status(404).json({ error: "Cannot find mechanic user" })
        }
        let mechResult = await Mechanic.findOne({
            userID: userResult._id
        })
        if (mechResult == null) {
            res.status(404).json({ error: "Cannot find mechanic user" })
        }
        
        let joMech = await JobOrderMechanic.create({
            jobOrderID: joResult._id,
            mechanicID: mechResult._id
        })
        assignedMech.push(joMech._id)
        if (joMech == null) {
            // throw new Error("Failed to assign mechanics")
            res.status(500).json({ error: "Failed to assign mechanic" })
        }
    })

    let assignedJobs = []
    joInfo.selectedJobs.map(async element => {
        let jobNameResult = await JobName.findOne({
            name: element.name,
        })
        let jobItemResult = await JobItem.findOne({
            jobID: jobNameResult._id
        })

        let joDetailsResult = await JobOrderDetails.create({
            jobOrderID: joResult._id,
            jobID: jobItemResult._id
        })
    })

    let createdItems = []
    joInfo.partsList.map(async element => {
        let itemResult = await Item.findOne({
            itemNumber: joInfo.itemNumber
        })

        let itemStatusResult = await JobOrderItemStatus.findOne({
            name: element.status
        })
        if (itemResult == null || itemStatusResult == null)
            res.status(404).json({ error: "Cannot find item" })
        
        let joItem = await JobOrderItem.create({
            jobOrderID: joResult._id,
            itemID: itemResult._id,
            itemStatusID: itemStatusResult._id,
            requestQty: element.quantity,
        })
        createdItems.push(joItem._id)
        if (joItem == null) {
            res.status(500).json("Failed to save parts list")
        } else {

            // let requesterID = await User.findOne({
            //     userID: joInfo.requesterID
            // })

            let requestResult = await JobOrderRequest.create({
                jobOrderItemID: joItem._id,
                requestedQty: element.quantity,
                // requesterID: requesterID._id,
                requestReason: "Job order created"
            }) 
        }
    })

}