import { connectToDatabase } from "@/lib/db";
import Item from "@/models/spareParts/ItemSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import { getRandomInt, calcQuantityStatus } from "@/lib/dataHandler";

export default async (req, res) => {
    await connectToDatabase();

    let items = await Item.find({})
        .populate("imageID", "secure_url disabled")
        .populate("categoryID", "pubId name disabled")
        .populate("unitID", "pubId name abbreviation disabled")

    let details = await ItemDetails.find({})
        .populate("itemBrandID", "pubId name disabled")
    
    let totalValue = 0
    items.map(item => {
        let detailsArray = []
        let quantity = 0
        let itemValue = 0
        details.map(detail => {
            if (item._id.toString() == detail.itemID.toString() && !detail.disabled) {
                detailsArray.push(detail)
                quantity += detail.quantity
                itemValue += parseFloat(detail.unitPrice) * detail.quantity
            }
        })
        item.set("details", detailsArray, {strict: false})
        item.set("quantity", quantity, {strict: false})
        item.set("itemValue", itemValue.toFixed(2), {strict: false})
        item.set("status", calcQuantityStatus(quantity, item.reorderPoint), {strict: false})
        item.set("eoq", getRandomInt(0, 20), {strict: false}) // TEMPORARY ONLY
        totalValue += itemValue
    })

    let count = {
        total : items.length,
        lowStock: items.filter(item => {
            return item.get("status") == "Low Stock"
        }).length,
        outOfStock: items.filter(item => {
            return item.get("status") == "Out of Stock"
        }).length
    }
        
    
    res.json({
        parts: items,
        count: count,
        totalValue: totalValue.toFixed(2)
    })
}
