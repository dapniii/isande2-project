import { connectToDatabase } from "@/lib/db";
import Item from "@/models/spareParts/ItemSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import JobOrderItem from "@/models/jobOrders/JobOrderItemSchema";
import PurchaseOrderPartsList from "@/models/purchaseOrders/PurchaseOrderPartsListSchema";
import { formatDistanceStrict, isWithinInterval, subMilliseconds, addDays } from "date-fns";

export default async (req, res) => {
    await connectToDatabase();
    const filters = req.body
    console.log(filters)

    // if (filters.startDate == null) filters["startDate"] = "All"
    // if (filters.endDate == null) filters["endDate"] = "All"

    function getQty (d) {
        return d.quantity
    }

    function getUnitValue(d) {
        return parseFloat(d.unitPrice) * parseInt(d.quantity)
    }

    function getUsedCost(jo) {
        return parseFloat(jo.detailID.unitPrice) * parseInt(jo.receivedQty-jo.returnQty)
    }

    function getUsedQty(jo) {
        return parseInt(jo.receivedQty-jo.returnQty)
    }

    function getPurchasedValue(po) {
        return parseFloat(po.unitCost) * parseInt(po.requestedQty)
    }

    function getPurchasedQty(po) {
        return parseInt(po.requestedQty)
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
        if (filters.startDate != "All" 
            && filters.endDate != "All" 
        ) {
            return isWithinInterval(new Date(date), {
                start: new Date(filters.startDate),
                end: subMilliseconds(addDays(new Date(filters.endDate), 1), 1)
            })
        }

        else return true
    }

    function isWithinFilters(item) {
        return item.categoryID.name == filters.category || filters.category == "All"
    }

    let items = await Item.find({disabled:false})
        .populate("categoryID", "name")
        .populate("unitID", ["name", "abbreviation"])
    let details = await ItemDetails.find({disabled: false})
        .populate("itemBrandID", "name")
    let joItems = await JobOrderItem.find({})
        .populate("jobOrderID")
        .populate("detailID")
    let poItems = await PurchaseOrderPartsList.find({})
        .populate("poID")
        
    items.map(i => {
        let detailsArray = details.filter(d => i._id.toString() == d.itemID.toString())
        let partsUsed = joItems.filter(j => 
            i._id.toString() == j.itemID.toString()
            && isWithinDateRange(j.jobOrderID.createdAt)
        )
        let partsPurchased = poItems.filter(p => 
            i._id.toString() == p.itemID.toString()
            && isWithinDateRange(p.poID.createdAt)
        )

        
        i.set("quantity", detailsArray.map(getQty).reduce(sum, 0), {strict: false})
        i.set("totalValue", detailsArray.map(getUnitValue).reduce(sum, 0), {strict: false})
        // i.set("usedCost", partsUsed.map(getUsedCost).reduce(sum, 0), {strict: false})
        // i.set("avgUsedCost", partsUsed.map(getUsedCost).reduce(sum, 0)/partsUsed.length, {strict: false})
        i.set("usedCount", partsUsed.map(getUsedQty).reduce(sum, 0), {strict: false})
        i.set("avgUsedCount", partsUsed.map(getUsedQty).reduce(sum, 0)/partsUsed.length, {strict: false})
        i.set("purchasedValue", partsPurchased.map(getPurchasedValue).reduce(sum, 0), {strict: false})
        i.set("avgPurchasedValue", partsPurchased.map(getPurchasedValue).reduce(sum, 0)/partsPurchased.length, {strict: false})
        i.set("purchasedCount", partsPurchased.map(getPurchasedQty).reduce(sum, 0), {strict: false})
        i.set("avgPurchasedCount", partsPurchased.map(getPurchasedQty).reduce(sum, 0)/partsPurchased.length, {strict: false})

    })
    
    res.json(items.filter(i => isWithinFilters(i)))
}
