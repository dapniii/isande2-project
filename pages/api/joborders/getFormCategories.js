import Vehicle from "@/models/vehicles/VehicleSchema";
import Mechanic from "@/models/users/MechanicSchema";
import JobItem from "@/models/jobOrders/descriptionItems/JobItemSchema";

export default async (req, res) => {

    let vehicles = await Vehicle.find({})
        
    let mechanics = await Mechanic.find({})
        .populate({
            path: "userID",
            select: "firstName lastName",
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

    res.json({
        vehicles,
        mechanics,
        jobItems
    })
}
