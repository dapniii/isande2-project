import { connectToDatabase } from "@/lib/db";
import FuelIn from "@/models/fuel/FuelInSchema";
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
        return true
    }

    let fuelIn = await FuelIn.find({})
    let users = await User.find({})

    fuelIn.map(fi => {
        fi.set("recordedBy", users.find(u => u.userID == fi.creatorID), {strict: false})
    })

    res.json(fuelIn.filter(fo => isWithinDateRange(fo.fRecordDateTime) && isWithinFilters(fo)))

}