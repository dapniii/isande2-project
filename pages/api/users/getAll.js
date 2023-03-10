import { connectToDatabase } from "@/lib/db";
import User from "@/models/users/UserSchema";
import Mechanic from "@/models/users/MechanicSchema";


export default async (req, res) => {
    await connectToDatabase();

    let users = await User.find({})
    .populate("imageID")
    .populate("departmentID")
    .populate("roleID")
    .populate("userTypeID")

    let mechanics = await Mechanic.find({}).populate("specialtyID")
    
    users.map(user => {
        mechanics.map(mech => {
            if (user._id.toString() == mech.userID.toString()) {
                user.set("specialtyID", mech.specialtyID, {strict: false})
            }
        })
    })
    
    res.json(users)
}