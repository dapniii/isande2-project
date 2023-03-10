import { connectToDatabase } from "@/lib/db";
import ItemBrand from "@/models/spareParts/ItemBrandSchema";
import ItemCategory from "@/models/spareParts/ItemCategorySchema";
import Measure from "@/models/MeasureSchema";

export default async (req, res) => {
    await connectToDatabase();

    let itemBrands = await ItemBrand.find({})
    let itemCategories = await ItemCategory.find({})
    let measures = await Measure.find({})

    res.json({
        brands: itemBrands,
        categories: itemCategories,
        measures,
    })
}