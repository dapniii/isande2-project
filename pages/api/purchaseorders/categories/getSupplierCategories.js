import { connectToDatabase } from "@/lib/db";
import City from "@/models/purchaseOrders/categories/CitySchema";
import Province from "@/models/purchaseOrders/categories/ProvinceSchema";

export default async (req, res) => {
    await connectToDatabase() 

    let cities = await City.find({disabled: false})
    let provinces = await Province.find({disabled: false})

    res.json({
        cities,
        provinces
    })
}