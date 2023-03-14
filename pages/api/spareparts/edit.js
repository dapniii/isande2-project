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

    const bodyData = req.body
    const bodyDetails = req.body.details

    const itemInfo = await Item.findOne({itemNumber: bodyData.itemNumber})
    // if (itemInfo != null) {
    //     // Get category id
    //     let catObjID = await ItemCategory.findOne({name: itemInfo.categoryID})
    //     itemInfo.categoryID = catObjID._id
        
    //     // Get measure id 
    //     let measureObjId = await Measure.findOne({name: itemInfo.unitID})
    //     itemInfo.unitID = measureObjId._id

    //     // Add image details to image collection
    //     if (bodyData.imageID != "") {
    //         let imageResult = await Image.findByIdAndUpdate(userInfo.imageID,
    //             {
    //                 secure_url: bodyData.imageID.secure_url,
    //                 disabled: false,
    //             })
    //             bodyData.imageID = imageResult._id
    //     }

        // let itemResult = await itemInfo.findByIdAndUpdate({
            
        // })
        
    // }

    bodyDetails.additions.map(async element => {
        let addResult = await ItemDetails.create({
            itemID: itemInfo._id,
            itemNumber: itemInfo.itemNumber,
            partNumber: element.partNum,
            itemBrandID: brandResult._id,
            quantity: element.qty,
            unitPrice: element.cost,
        })

        console.log(addResult)
    })

    bodyDetails.edits.map(async element => {
        
        if (element.itemNumber == null) {
            let brandResult = await ItemBrand.findOne({name: element.brand})
    
            let detailsResult = await ItemDetails.findByIdAndUpdate(element._id, {
                partNumber: element.partNum,
                itemBrandID: brandResult._id,
                // quantity: element.qty, 
                unitPrice: element.cost
            })
           
            console.log(detailsResult)
        }

        if (element.disabled == true) {
            let disabledResult = await ItemDetails.findByIdAndUpdate(element._id, {
                disabled: element.disabled
            })

            console.log()
        }
            
    })
    res.json("done")

}