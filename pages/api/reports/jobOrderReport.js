import { connectToDatabase } from "@/lib/db";
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import JobOrderItem from "@/models/jobOrders/JobOrderItemSchema";
import JobOrderMechanic from "@/models/jobOrders/JobOrderMechanicSchema";
import { formatDistanceStrict, isWithinInterval, subMilliseconds, addDays } from "date-fns";

export default async (req, res) => {
    await connectToDatabase();
    const filters = req.query;

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

    let jobOrders = await JobOrder.find({})
        .populate("vehicleID")
        .populate("statusID")

    let joParts = await JobOrderItem.find({})
        .populate("jobOrderID")
        .populate("detailID")

    let joMechanics = await JobOrderMechanic.find({})
    .populate({
        path: "mechanicID",
        populate: [
            {
                path: "userID",       
                model: "User", 
            }, 
        ]})

    jobOrders.map(jo => {
        let joItem = joParts.filter(item => item.jobOrderID._id.toString() == jo._id.toString())
        let mechanics = joMechanics.filter(mech => mech.jobOrderID.toString() == JO._id.toString())

        jo.set("mechanics", mechanics, {strict: false})
        jo.set("jobOrderCost", joItem.map(getUnitCost).reduce(sum, 0), {strict: false})
        jo.set("jobOrderParts", joItem, {strict: false})
        try {
            jo.set("repairDuration", getDateDistance(jo.createdAt, jo.completedDate), {strict : false})
        } catch {}
    })

    res.json(jobOrders)
}