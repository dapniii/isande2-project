import Vehicle from "@/models/vehicles/VehicleSchema";
import Mechanic from "@/models/users/MechanicSchema";
import Item from "@/models/spareParts/ItemSchema";
import JobItem from "@/models/jobOrders/descriptionItems/JobItemSchema";
import Specialty from "@/models/users/SpecialtySchema";
import JobOrderStatus from "@/models/jobOrders/categories/JobOrderStatusSchema";
import JobOrder from "@/models/jobOrders/JobOrderSchema";

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
        .populate("itemID")
    let partItems = await Item.find({})
    let specialties = await Specialty.find({})
    let jobOrderStatus = await JobOrderStatus.find({})
    let joCount = await JobOrder.find({})

    res.json({
        vehicles,
        mechanics,
        jobItems,
        partItems,
        specialties,
        jobOrderStatus,
        count: joCount.length
    })
}
