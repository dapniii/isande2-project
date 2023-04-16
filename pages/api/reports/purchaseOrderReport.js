import { connectToDatabase } from "@/lib/db";
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema";
import PurchaseOrderPartsList from "@/models/purchaseOrders/PurchaseOrderPartsListSchema";
import { formatDistanceStrict, isWithinInterval, subMilliseconds, addDays } from "date-fns";

export default async (req, res) => {
    await connectToDatabase();
    const filters = req.body;

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

    let purchaseOrders = await PurchaseOrder.find({}).sort([["updatedAt", -1]])
        .populate("statusID")
        .populate("supplierID")
        .populate("requestedBy")
    let poItems = await PurchaseOrderPartsList.find({})
        .populate("itemID")
        .populate("detailID")
        .populate("poID")


    purchaseOrders.map(PO => {
        let totalCost = 0.00
        let partsList = poItems.filter(item => item.poID._id.toString() == PO._id.toString())
        partsList.map(part => {
            totalCost += parseFloat(part.unitCost)
        })

        PO.set("partsList", partsList, {strict: false})
        PO.set("totalCost", totalCost, {strict: false})
    })

    // res.json(purchaseOrders.filter(po => isWithinDateRange(po.createdAt)))
    res.json(poItems.filter(po => isWithinDateRange(po.poID.createdAt)))

}
