import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Item from "@/models/spareParts/ItemSchema";
import ItemCategory from "@/models/spareParts/ItemCategorySchema";
import Measure from "@/models/MeasureSchema";
import ItemBrand from "@/models/spareParts/ItemBrandSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import Image from "@/models/ImageSchema";

export default async (req, res) => {
    await connectToDatabase();
    const ObjectId = mongoose.Types.ObjectId

    const bodyData = req.body
    const bodyDetails = req.body.details
    console.log(bodyData.details)
    const originalItem = await Item.findOne({itemNumber: bodyData.itemNumber})
    if (originalItem != null) {
        // Get category id
        let categoryID = await ItemCategory.findOne({name: bodyData.categoryID})

        // Get measure id 
        let unitID = await Measure.findOne({name: bodyData.unitID})
        
        let imageResult 
        try {
            imageResult = await Image.findByIdAndUpdate(originalItem.imageID, {
                secure_url: bodyData.imageID.secure_url,
                disabled: false,
            })
        } 
        catch(e) {}
        finally {
            let newItem = {}
            if (bodyData.itemName != originalItem.itemName)
                newItem["itemName"] = bodyData.itemName
            if (bodyData.itemModel != originalItem.itemModel)
                newItem["itemModel"] = bodyData.itemModel
            if (categoryID._id.toString() != originalItem.categoryID.toString())
                newItem["categoryID"] = categoryID._id
            if (bodyData.reorderPoint != originalItem.reorderPoint)
                newItem["reorderPoint"] = bodyData.reorderPoint
            if (unitID._id.toString() != originalItem.unitID.toString())
                newItem["unitID"] = unitID._id
            if (bodyData.description != originalItem.description)
                newItem["description"] = bodyData.description
            if (bodyData.disabled != null)
                newItem["disabled"] == bodyData.disabled


            try {
                let itemResult = await Item.findByIdAndUpdate(originalItem._id, newItem)
                // console.log(itemResult)
                bodyDetails.map(async element => {
                    let itemBrandID = element.itemBrandID._id ? 
                        (await ItemBrand.findById(element.itemBrandID._id)) : 
                        (await ItemBrand.findOne({name: element.itemBrandID}))

                    let updateResult = await ItemDetails.findByIdAndUpdate(element._id, {
                        itemID: originalItem._id,
                        partNumber: element.partNumber,
                        itemBrandID: itemBrandID._id,
                        quantity: element.quantity,
                        unitPrice: element.unitPrice,
                        disabled: element.disabled,
                    })
                    console.log(updateResult)
                })
                // bodyDetails.additions.map(async element => {
                //     let itemBrandID = await ItemBrand.findOne({name: element.brand})
                //     let addResult = await ItemDetails.create({
                //         itemID: originalItem._id,
                //         partNumber: element.partNum,
                //         itemBrandID: itemBrandID._id,
                //         quantity: element.qty,
                //         unitPrice: element.cost,
                //     })    
                //     console.log("Added detail")
                // })

                // bodyDetails.edits.map(async element => {
                //     if (element.itemNumber == null) {
                //         let brandResult = await ItemBrand.findOne({name: element.brand})
                        
                //         try {
                //             let detailsResult = await ItemDetails.findByIdAndUpdate(element._id, {
                //                 partNumber: element.partNum,
                //                 itemBrandID: brandResult._id,
                //                 // quantity: element.qty, 
                //                 unitPrice: element.cost,
                //                 disabled: element.disabled,
                //             })

                //             console.log("edited detail")
                //         } catch { console.log("do nothing")}

                //     }
                // })
                res.status(200).json("success")     
            } catch (e) {
                res.status(400).json({error: "Failed to update item"})
            }



        }
        
    } else {
        res.status(400).json("Cannot find item")
    }
}