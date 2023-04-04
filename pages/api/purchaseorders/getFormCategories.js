import { connectToDatabase } from "@/lib/db";
import Supplier from "@/models/purchaseOrders/categories/SupplierSchema";
import PurchaseOrderStatus from "@/models/purchaseOrders/categories/PurchaseOrderStatusSchema";
import City from "@/models/purchaseOrders/categories/CitySchema";
import Province from "@/models/purchaseOrders/categories/ProvinceSchema";
import Item from "@/models/spareParts/ItemSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import User from "@/models/users/UserSchema";


export default async (req, res) => {
    await connectToDatabase()

    let poStatus = await PurchaseOrderStatus.find({disabled: false})
    let suppliers = await Supplier.find({disabled: false})
        .populate("imageID")
        .populate("cityID")
        .populate("provinceID")
    let cities = await City.find({disabled: false})
    let provinces = await Province.find({disabled: false})


    res.json({
        poStatus,
        suppliers,
        cities,
        provinces
    })
}