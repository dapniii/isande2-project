import { connectToDatabase } from "@/lib/db";
import Image from "@/models/ImageSchema";
import User from "@/models/users/UserSchema";
import City from "@/models/purchaseOrders/categories/CitySchema";
import Province from "@/models/purchaseOrders/categories/ProvinceSchema";
import Supplier from "@/models/purchaseOrders/categories/SupplierSchema";

export default async (req, res) => {
    await connectToDatabase();

    const supplierInfo = req.body
    console.log(supplierInfo)

    let duplicateName = await Supplier.findOne({name: supplierInfo.name})

    if (duplicateName != null) {
        res.status(400).json({ error: "Supplier already exists" })
    }
    else {
        // Get creator id
        let creatorID = await User.findOne({ userID: supplierInfo.creatorID })
        let cityID = await City.findOne({name: supplierInfo.cityID})
        let provinceID = await Province.findOne({name: supplierInfo.provinceID})

        // Add image details to image collection
        let imageResult
        try {
            imageResult = await Image.create({
                secure_url: supplierInfo.imageID.secure_url,
                disabled: false,
            })
        } catch(e) {
            res.status(500).json({ error: "Failed to save image" })
        }
        let supplierResult = await Supplier.create({
            imageID: imageResult._id,
            name: supplierInfo.name,
            streetAddress: supplierInfo.streetAddress,
            cityID: cityID._id,
            provinceID: provinceID._id,
            email: supplierInfo.email,
            phone: supplierInfo.phone,
            creatorID: creatorID._id
        })

        res.json("success");

    }

}