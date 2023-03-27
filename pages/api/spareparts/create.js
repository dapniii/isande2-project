import { connectToDatabase } from "@/lib/db";
import ItemBrand from "@/models/spareParts/ItemBrandSchema";
import ItemCategory from "@/models/spareParts/ItemCategorySchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import Measure from "@/models/MeasureSchema";
import Image from "@/models/ImageSchema";
import User from "@/models/users/UserSchema";
import Item from "@/models/spareParts/ItemSchema";

export default async (req, res) => {
    await connectToDatabase();

    const itemInfo = req.body;
    console.log(itemInfo)
    let duplicateID = await Item.findOne({itemNumber: itemInfo.itemNumber})
    if (duplicateID != null) {
        res.status(400).json({ error: "Item ID already exists" })
    } else {
        // Get creator Id
        let creatorID = await User.findOne({ userID: itemInfo.creatorID })
        if (creatorID == null || creatorID.disabled) {
            res.status(401).json({ error: "Creator user ID not authorized" })
        }
            
        else {
            // Get category id
            let categoryID = await ItemCategory.findOne({name: itemInfo.categoryID})
            // Get measure id 
            let unitID = await Measure.findOne({name: itemInfo.unitID})
            // Add image details to image collection
            let imageResult
            try {
                imageResult = await Image.create({
                    secure_url: itemInfo.imageID.secure_url,
                    disabled: false,
                })
            } catch(e) {
                res.status(500).json({ error: "Failed to save image" })
            }

            // Create Item
            let itemResult = await Item.create({
                itemNumber: itemInfo.itemNumber,
                imageID: imageResult._id,
                categoryID: categoryID._id,
                itemName: itemInfo.itemName,
                itemModel: itemInfo.itemModel,
                reorderPoint: itemInfo.reorderPoint,
                unitID: unitID._id,
                description: itemInfo.description,
                creatorID: creatorID._id,
            });
            
            // Create item details
            let detailsArray = []
            itemInfo.details.map(async element => {
                let brandID = await ItemBrand.findOne({name: element.brand})

                let detailsResult = await ItemDetails.create({
                    itemID: itemResult._id,
                    partNumber: element.partNum,
                    itemBrandID: brandID._id,
                    quantity: element.qty,
                    unitPrice: element.cost
                })
                detailsArray.push(detailsResult)
            })

            res.status(200).json({
                item: itemResult,
                details: detailsArray,
                msg: "success"
            })
        }

    }
}
