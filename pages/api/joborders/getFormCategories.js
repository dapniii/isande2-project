import Vehicle from "@/models/vehicles/VehicleSchema";
import Mechanic from "@/models/users/MechanicSchema";
import Item from "@/models/spareParts/ItemSchema";
import ItemDetails from "@/models/spareParts/ItemDetailsSchema";
import JobItem from "@/models/jobOrders/descriptionItems/JobItemSchema";
import Specialty from "@/models/users/SpecialtySchema";
import JobOrderStatus from "@/models/jobOrders/categories/JobOrderStatusSchema";
import JobOrder from "@/models/jobOrders/JobOrderSchema";
import { calcQuantityStatus } from "@/lib/dataHandler";

export default async (req, res) => {

    let vehicles = await Vehicle.find({})
        .populate("vehicleTypeID")
        .populate("brandID")
        .populate("imageID")
    let mechanics = await Mechanic.find({})
        .populate({
            path: "userID",
            select: "firstName lastName userID",
            populate: [
                {
                    path: "imageID",       
                    model: "Image", 
                    select: "secure_url"
                }, 
                {
                    path: "userTypeID",
                    model: "UserType",
                }
            ]})
        .populate("specialtyID", "name")
    let jobItems = await JobItem.find({})
        .populate("jobID")
        .populate({
            path: "itemID",
            populate: [
                {
                    path: "imageID",       
                    model: "Image", 
                    select: "secure_url"
                }, 
                {
                    path: "unitID",
                    model: "Measure",
                },
                {
                    path: "categoryID",
                    model: "ItemCategory",
                }
            ]})
    let partItems = await Item.find({})
        .populate("unitID")
        .populate("categoryID")
    let itemDetails = await ItemDetails.find({})
        .populate("itemID")
        .populate("itemBrandID")
    let specialties = await Specialty.find({})
    let jobOrderStatus = await JobOrderStatus.find({})
    let joCount = await JobOrder.find({})

    let totalValue = 0
    partItems.map(item => {
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
        vehicles,
        mechanics,
        jobItems,
        partItems,
        itemDetails,
        specialties,
        jobOrderStatus,
        count: joCount.length
    })
}
