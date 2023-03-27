import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import Item from "@/models/spareParts/ItemSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import { getRandomInt, calcQuantityStatus } from "@/lib/dataHandler";

export default async (req, res) => {
    await connectToDatabase();
    var ObjectId = mongoose.Types.ObjectId;

    let itemInfo = await Item.findOne({
        itemNumber: req.query.itemNumber
    }, {__v: 0})
    .populate("imageID", "pubId secure_url disabled")
    .populate("categoryID", "pubId name disabled")
    .populate("unitID", "pubId name abbreviation disabled")

    let detailsInfo = await ItemDetails.find({
        itemID: itemInfo._id,
    }, {__v: 0}).populate("itemBrandID", "pubId name disabled")

    let detailsArray = []
    let inactiveDetails = []
    let quantity = 0
    let itemValue = 0
    detailsInfo.map(detail => {
        if (detail.disabled == false) {
            detailsArray.push(detail)
            quantity += detail.quantity
            itemValue += parseFloat(detail.unitPrice)
        }
        else if (detail.disabled == true){
            inactiveDetails.push(detail)
        }
    })

    itemInfo.set("details", detailsArray, {strict: false})
    itemInfo.set("inactiveDetails", inactiveDetails, {strict: false})
    itemInfo.set("quantity", quantity, {strict: false})
    itemInfo.set("itemValue", itemValue, {strict: false})
    itemInfo.set("status", calcQuantityStatus(quantity, itemInfo.reorderPoint), {strict: false})
    itemInfo.set("eoq", getRandomInt(0, 20), {strict: false}) // TEMPORARY ONLY

    if (itemInfo == null) {
        let error = "Item not found";
        console.log(`Error: ${error}`);
        res.json(error);
    } else {
        console.log(`Found item ${itemInfo.itemName}`)
        res.json(itemInfo);
    }
}