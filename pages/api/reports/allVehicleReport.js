import { connectToDatabase } from "@/lib/db";
import Vehicle from "@/models/vehicles/VehicleSchema";
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import JobOrderItem from "@/models/jobOrders/JobOrderItemSchema";
import JobOrderMechanic from "@/models/jobOrders/JobOrderMechanicSchema";
import JobOrderDetails from "@/models/jobOrders/JobOrderDetailsSchema";
import { formatDistanceStrict, isWithinInterval, subMilliseconds, addDays } from "date-fns";

export default async (req, res) => {
    await connectToDatabase();
    const filters = req.query

    if (filters.startDate == null) filters.startDate = "All"
    if (filters.endDate == null) filters.endDate == "All"

    function getUnitCost(item) {
        return parseFloat(item.detailID.unitPrice) * parseInt(item.receivedQty-item.returnQty)
    }

    function getJobOrderCost(jo) {
        return parseFloat(jo.toJSON().jobOrderCost)
    }

    function getRepairDuration(jo) {
        return parseInt(jo.toJSON().repairDuration.split(" ")[0])
    }
    
    function sum(prev, next){
        return prev + next;
    }

    function getDateDistance(startDate, endDate) {
        return formatDistanceStrict(new Date(endDate), new Date(startDate), {
            addSuffix: false,
            unit: 'day'
        })
    }

    function isWithinDateRange(date) {
        if (filters.startDate != "All" || filters.startDate != null 
            && filters.endDate != "All" && filters.endDate != null
        )
            return isWithinInterval(new Date(date), {
                start: new Date(filters.startDate),
                end: subMilliseconds(addDays(new Date(filters.endDate), 1), 1)
            })
        else return true
    }

    function isWithinFilters(vehicle) {
        return true
    }

    
    let vehicles = await Vehicle.find({})
        .populate("vehicleTypeID", "name")
        .populate("brandID", "name")
        .populate("transmissionID", "name")
        .populate("engineTypeID", "name")
        .populate("chassisTypeID", "name")
        .populate("tireSizeID", "name")
        .populate("gpsID", "name")
        .populate("fuelSensorID", "name")
        .populate("vehicleStatusID", "name")

    let jos = await JobOrder.find({})
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
            ]
        })

    let joParts = await JobOrderItem.find({})
        .populate("jobOrderID")
        .populate("itemID")
        .populate("detailID")

    let joDetails = await JobOrderDetails.find({})
        .populate("jobID")

    let updateJos = jos.map(jo => {
        let joItem = joParts.filter(item => item.jobOrderID._id.toString() == jo._id.toString())
        let joMech = joMechanics.filter(mech => mech.jobOrderID.toString() == jo._id.toString())
        let jobList = joDetails.filter(job => job.jobOrderID.toString() == jo._id.toString())


        jo.set("jobOrderCost", joItem.map(getUnitCost).reduce(sum, 0), {strict: false})
        jo.set("jobOrderParts", joItem, {strict: false})
        try {
            jo.set("repairDuration", getDateDistance(jo.createdAt, jo.updatedAt), {strict : false})
        } catch {}

        return jo
        // jo.set("assignedMechanics", joMech, {strict:false})
        // jo.set("jobList", jobList, {strict: false})
    })

    vehicles.map(v => {
        let vJos = updateJos.filter(j => 
            j.vehicleID.plateNumber == v.plateNumber
            && isWithinDateRange(j.createdAt)
        )
        v.set("jobOrders", vJos, {strict: false})
        v.set("totalJoCount", vJos.length, {strict: false})
        
        try {
            let totalCost = vJos.map(getJobOrderCost).reduce(sum)
            let totalDuration = vJos.map(getRepairDuration).reduce(sum)
            v.set("totalRepairCost", totalCost, {strict: false})
            v.set("avgRepairCost", totalCost/vJos.length, {strict: false})
            v.set("avgRepairDuration", totalDuration/vJos.length, {strict: false})
        } catch{}
    })
    
    let result = vehicles.filter(v => isWithinFilters(v))
    
    res.json(result)
}