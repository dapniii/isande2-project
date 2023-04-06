import { connectToDatabase } from "@/lib/db";
import Supplier from "@/models/purchaseOrders/categories/SupplierSchema";
import PurchaseOrderStatus from "@/models/purchaseOrders/categories/PurchaseOrderStatusSchema";
import City from "@/models/purchaseOrders/categories/CitySchema";
import Province from "@/models/purchaseOrders/categories/ProvinceSchema";
import Item from "@/models/spareParts/ItemSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import User from "@/models/users/UserSchema";
import { calcQuantityStatus } from "@/lib/dataHandler";

export default async (req, res) => {
    await connectToDatabase()

    let poStatus = await PurchaseOrderStatus.find({disabled: false})
    let suppliers = await Supplier.find({disabled: false})
        .populate("imageID")
        .populate("cityID")
        .populate("provinceID")
    let cities = await City.find({disabled: false})
    let provinces = await Province.find({disabled: false})
    let partsList = await Item.find({disabled: false})
        .populate("unitID")
        .populate("categoryID")
    let itemDetails = await ItemDetails.find({disabled: false})
        .populate("itemID")
        .populate("itemBrandID")
    let users = await User.find({disabled: false})
    
    let totalValue = 0
    partsList.map(item => {
        let detailsArray = []
        let quantity = 0
        let itemValue = 0

        itemDetails.map(detail => {
            if (item._id.toString() == detail.itemID._id.toString() && !detail.disabled) {
                detailsArray.push(detail)
                quantity += detail.quantity
                itemValue += parseFloat(detail.unitPrice) * detail.quantity
            }
        })
        item.set("details", detailsArray, {strict: false})
        item.set("quantity", quantity, {strict: false})
        item.set("itemValue", itemValue.toFixed(2), {strict: false})
        item.set("status", calcQuantityStatus(quantity, item.reorderPoint), {strict: false})
        totalValue += itemValue
    })

    res.json({
        poStatus,
        suppliers,
        cities,
        provinces,
        partsList,
        users,
    })
}