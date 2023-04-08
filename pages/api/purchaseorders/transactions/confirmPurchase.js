import { connectToDatabase } from "@/lib/db";
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema";
import PurchaseOrderFile from "@/models/purchaseOrders/PurchaseOrderFileSchema";
import PurchaseOrderStatus from "@/models/purchaseOrders/categories/PurchaseOrderStatusSchema";
import PurchaseOrderPartsList from "@/models/purchaseOrders/PurchaseOrderPartsListSchema";
import User from "@/models/users/UserSchema";
import ItemBrand from "@/models/spareParts/ItemBrandSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import { generateID } from "@/lib/dataHandler";

export default async (req, res) => {
    await connectToDatabase();

    const poInfo = req.body;
    console.log(poInfo)
    
    let statusID = await PurchaseOrderStatus.findOne({name: "Purchased"})
    let purchasedByID = await User.findOne({userID: poInfo.purchasedBy})

    poInfo.detailedParts.map(async item => {
        // If new item details
        if (item.detailID.length == 0) {
            let brandID = await ItemBrand.findOne({name: item.brand})
            let allBrand = await ItemBrand.find({})

            // Create brand if it doesn't exist
            if (brandID == null) {
                brandID = await ItemBrand.create({
                    pubId: generateID(allBrand.length, 5),
                    name: item.brand,
                })
            }

            // Insert to item detail collection
            item.detailID = await ItemDetails.create({
                itemID: item.itemID._id,
                partNumber: item.partNumber,
                itemBrandID: brandID._id,
                quantity: 0,
                unitPrice: item.unitCost
            })
            
            let updatePoParts = await PurchaseOrderPartsList.findByIdAndUpdate(
                item._id, {
                    detailID: item.detailID._id,
                    unitCost: item.unitCost
                }
            )
            console.log(updatePoParts)
        }

        else {
            let updatePoParts = await PurchaseOrderPartsList.findByIdAndUpdate(
                item._id, {
                    detailID: item.detailID,
                    unitCost: item.unitCost
                }
            )
            console.log(updatePoParts)
        }
    })

    poInfo.uploadedFiles.map(async file => {
        let poFileRes = await PurchaseOrderFile.create({
            poID: poInfo.poID,
            filename: file.public_id.split("/")[1],
            secure_url: file.secure_url
        })

        console.log(poFileRes)
    })

    let updatePo = await PurchaseOrder.findByIdAndUpdate(poInfo.poID, {
        statusID: statusID._id,
        purchasedDate: poInfo.purchasedDate,
        purchasedBy: purchasedByID._id
    })


    res.json("success")
}

