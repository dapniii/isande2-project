import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import Vehicle from "@/models/vehicles/VehicleSchema";
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import JobOrderItem from "@/models/jobOrders/JobOrderItemSchema";
import JobOrderMechanic from "@/models/jobOrders/JobOrderMechanicSchema";
import JobOrderDetails from "@/models/jobOrders/JobOrderDetailsSchema";


export default async (req, res) => {

    function getUnitCost(item) {
        return parseFloat(item.detailID.unitPrice) * parseInt(item.receivedQty-item.returnQty)
    }
    
    function sum(prev, next){
        return prev + next;
    } 

    await connectToDatabase()
    var ObjectId = mongoose.Types.ObjectId

    let vehicleInfo = await Vehicle.findOne({
        plateNumber: req.query.plateNumber
    })
    .populate("imageID")
    .populate("vehicleTypeID")
    .populate("brandID")
    .populate("transmissionID")
    .populate("engineTypeID")
    .populate("chassisTypeID")
    .populate("tireSizeID")
    .populate("gpsID")
    .populate("fuelSensorID")
    .populate("vehicleStatusID")

    let jobOrders = await JobOrder.find({
        vehicleID: vehicleInfo._id
    })
    .populate("vehicleID")
    .populate("statusID")
    
    let joItems = await JobOrderItem.find({})
    .populate("jobOrderID")
    .populate("itemID")
    .populate("detailID")

    let mechanics = await JobOrderMechanic.find({}).populate({
        path: "mechanicID",
        populate: [
            {
                path: "userID",       
                model: "User", 
            }, 
        ]})
    let jobNames = await JobOrderDetails.find({})
        .populate("jobID")

    jobOrders.map(jo => {
        let joItem = joItems.filter(item => item.jobOrderID._id.toString() == jo._id.toString())
        let joMechanics = mechanics.filter(mech => mech.jobOrderID.toString() == jo._id.toString())
        let jobList = jobNames.filter(job => job.jobOrderID.toString() == jo._id.toString())

        jo.set("jobOrderCost", joItem.map(getUnitCost).reduce(sum), {strict: false})
        jo.set("jobOrderParts", joItem, {strict: false})
        jo.set("assignedMechanics", joMechanics, {strict:false})
        jo.set("jobList", jobList, {strict: false})

    })
    vehicleInfo.set("serviceHistory", jobOrders, {strict: false})

    if (vehicleInfo == null) {
        let error = "Vehicle not found";
        console.log(`Error: ${error}`);
        res.json(error);
    } else {
        console.log(`Found vehicle ${vehicleInfo.plateNumber}`)
        res.json(vehicleInfo);
    }
}