import { connectToDatabase } from "@/lib/db";
import ItemBrand from "@/models/spareParts/ItemBrandSchema";
import ItemCategory from "@/models/spareParts/ItemCategorySchema";
import Measure from "@/models/MeasureSchema";
import ItemStatus from "@/models/spareParts/ItemStatusSchema";
import ItemAdjustmentReason from "@/models/spareParts/ItemAdjustmentReasonSchema";

export default async (req, res) => {
    await connectToDatabase();

    let itemBrands = await ItemBrand.find({})
    let itemCategories = await ItemCategory.find({})
    let measures = await Measure.find({})
    let status = await ItemStatus.find({})
    let reasons = await ItemAdjustmentReason.find({})

    res.json({
        brands: itemBrands,
        categories: itemCategories,
        measures,
        status,
        reasons
    })
}