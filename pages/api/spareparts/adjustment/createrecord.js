import { connectToDatabase } from "@/lib/db";
import Item from "@/models/spareParts/ItemSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import ItemAdjustment from "@/models/spareParts/ItemAdjustmentSchema";
import ItemAdjustmentReason from "@/models/spareParts/ItemAdjustmentReasonSchema";
import User from "@/models/users/UserSchema";


export default async (req, res) => {
    await connectToDatabase();

    const adjustInfo = req.body

    let creatorInfo = await User.findOne({
        userID: adjustInfo.creatorID
    })


    let itemInfo = await Item.findOne({
        itemNumber: adjustInfo.itemID
    }) 
    let reasonInfo = await ItemAdjustmentReason.findOne({
        name: adjustInfo.reasonID
    })
    
    adjustInfo.edits.forEach(async element => {
        
        if (element.newQuantity != null && element.quantity != element.newQuantity) {
            let editInfo = await ItemDetails.findByIdAndUpdate(element._id, {
                quantity: element.newQuantity
            })
            
            let newAdjust = await ItemAdjustment.create({
                itemID: itemInfo._id,
                itemDetailID: element._id,
                reasonID: reasonInfo._id,
                comment: element.comment,
                newQuantity: element.newQuantity,
                discrepancy: element.newQuantity - element.quantity,
                creatorID: creatorInfo._id
            })

        }
    })

    res.json("success")
}

