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

    let duplicateID = await Item.findOne({itemNumber: itemInfo.itemNumber})

    if (duplicateID != null) {
        console.log("Duplicate item ID")
    } else {

        // Get creator id 
        if (itemInfo.creatorID != "" || itemInfo.creatorID != null) {
            let creatorObjID = await User.findOne({ userID: itemInfo.creatorID })
            itemInfo.creatorID = creatorObjID._id
        }
        else {
            delete itemInfo.creatorID
        }

        // Get category id
        let catObjID = await ItemCategory.findOne({name: itemInfo.categoryID})
        itemInfo.categoryID = catObjID._id
        
        // Get measure id 
        let measureObjId = await Measure.findOne({name: itemInfo.unitID})
        itemInfo.unitID = measureObjId._id

        // // Add image details to image collection
        let imageResult = await Image.create({
            secure_url: itemInfo.imageID.secure_url,
            disabled: false,
        })
        itemInfo.imageID = imageResult._id
        
        // Create Item
        let itemResult = await Item.create({
            itemNumber: itemInfo.itemNumber,
            imageID: itemInfo.imageID,
            categoryID: itemInfo.categoryID,
            itemName: itemInfo.itemName,
            itemModel: itemInfo.itemModel,
            reorderPoint: itemInfo.reorderPoint,
            unitID: itemInfo.unitID,
            description: itemInfo.description,
            creatorID: itemInfo.creatorID
        });

        // // Create item details
        let detailsArray = []
        itemInfo.details.map(async element => {
            let brandObjId = await ItemBrand.findOne({name: element.brand})
            element.brand = brandObjId._id

            let detailsResult = await ItemDetails.create({
                itemID: itemResult._id,
                itemNumber: itemInfo.itemNumber,
                partNumber: element.partNum,
                itemBrandID: element.brand,
                quantity: element.qty,
                unitPrice: element.cost
            })

            detailsArray.push(detailsResult)
        })
        
        res.json({
            item: itemResult,
            details: detailsArray,
            msg: "success"
        })
    }
}
