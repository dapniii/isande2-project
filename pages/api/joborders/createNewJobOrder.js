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
    console.log(joInfo)
    // Get vehicle
    let vehicleID = await Vehicle.findOne({
        plateNumber: joInfo.vehicleID
    })

    // Get job order status
    let statusID = await JobOrderStatus.findOne({
        name: joInfo.statusID
    })

    // Get creator
    let creatorID = User.findOne({
        userID: joInfo.creatorID
    })

    // Store jo info in JobOrderSchema
    let joResult = await JobOrder.create({
        jobOrderID: joInfo.jobOrderID,
        vehicleID: vehicleID._id,
        statusID: statusID._id,
        description: joInfo.description,
        creatorID: creatorID._id,
        // isTemplate: joInfo.isTemplate,
    })
    console.log("Added to Job Order collection")

    let assignedMech = []
    joInfo.mechanics.map(async element => {
        let name = element.split(" ")
        let userResult = await User.findOne({
            firstName: name[0],
            lastName: name[1]
        })

        let mechResult = await Mechanic.findOne({
            userID: userResult._id
        })
        
        let joMech = await JobOrderMechanic.create({
            jobOrderID: joResult._id,
            mechanicID: mechResult._id
        })
        console.log("Added to job order mechanics collection")

        assignedMech.push(joMech._id)
    })

    let assignedJobs = []
    joInfo.selectedJobs.map(async element => {
        let jobNameResult = await JobName.findOne({
            name: element,
        })

        let joDetailsResult = await JobOrderDetails.create({
            jobOrderID: joResult._id,
            jobID: jobNameResult._id
        })
        console.log("Added to job order details collection")

    })

    let createdItems = []
    joInfo.partsList.map(async element => {

        let joItem = await JobOrderItem.create({
            jobOrderID: joResult._id,
            itemID: element.itemID,
            // itemStatusID: itemStatusResult._id,
            requestQty: element.quantity + element.manualQty,
        })
        console.log("Added to job order items collection")

        createdItems.push(joItem._id)
        if (joItem == null) {
            res.status(500).json("Failed to save parts list")
        } else {

            let requesterID = await User.findOne({
                userID: joInfo.creatorID
            })

            let requestResult = await JobOrderRequest.create({
                jobOrderItemID: joItem._id,
                requestedQty: element.quantity,
                requesterID: creatorID._id,
                requestReason: `Job Order #${joInfo.jobOrderID} newly created`
            }) 
            console.log("Added to job order request collection")

        }
    })

    res.status(200).json("done")

}