import { connectToDatabase } from "@/lib/db";
import FuelOut from "@/models/fuel/FuelOutSchema";
import User from "@/models/users/UserSchema";
import { formatDistanceStrict, isWithinInterval, subMilliseconds, addDays } from "date-fns";


export default async (req, res) => {
    await connectToDatabase();
    const filters = req.body;
    console.log(filters)

    function isWithinDateRange(date) {

        if (filters.startDate != "All" || filters.startDate != null 
            && filters.endDate != "All" && filters.endDate != null
        )
            return isWithinInterval(new Date(date), {
                start: new Date(filters.startDate),
                end: subMilliseconds(addDays(new Date(filters.endDate), 1), 1)
            })
        else return true
    }

    function isWithinFilters(fo) {
        return filters.vehicle == "All" || fo.oPlateNumber.plateNumber == filters.vehicle 
    }

    let fuelOut = await FuelOut.find({})
        .populate("oPlateNumber")
    let users = await User.find({})

    fuelOut.map(fi => {
        fi.set("recordedBy", users.find(u => u.userID == fi.creatorID), {strict: false})
    })

    res.json(fuelOut.filter(fo => isWithinDateRange(fo.creationDate) && isWithinFilters(fo)))

}