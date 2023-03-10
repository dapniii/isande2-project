import { connectToDatabase } from "@/lib/db";
import Item from "@/models/spareParts/ItemSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

export default async (req, res) => {
    await connectToDatabase();

    let items = await Item.find({})
        .populate("imageID")
        .populate("categoryID")
        .populate("unitID")

    let details = await ItemDetails.find({})
        .populate("itemBrandID")
    
    items.map(item => {
        let detailsArray = []
        let quantity = 0
        let totalValue = 0
        details.map(detail => {
            if (item._id.toString() == detail.itemID.toString() && !detail.disabled) {
                detailsArray.push(detail)
                quantity += detail.quantity
                totalValue += detail.unitPrice
            }
        })
        item.set("details", detailsArray, {strict: false})
        item.set("quantity", quantity, {strict: false})
        item.set("totalValue", totalValue, {strict: false})

        if (quantity == 0)
            item.set("status", "Out of Stock", {strict: false})
        else if (quantity  <= item.reorderPoint)
            item.set("status", "Low Stock", {strict: false})   
        else
            item.set("status", "In Stock", {strict: false})
        
        item.set("eoq", getRandomInt(0, 20), {strict: false})
    })
    
    res.json(items)
}
