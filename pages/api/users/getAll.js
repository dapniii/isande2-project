import { connectToDatabase } from "@/lib/db";
import User from "@/models/users/UserSchema";
import Mechanic from "@/models/users/MechanicSchema";


export default async (req, res) => {
    await connectToDatabase();

    let active = await User.find({disabled: false})
    .populate("imageID")
    .populate("departmentID")
    .populate("roleID")
    .populate("userTypeID")

    let inactive = await User.find({disabled: true})
    .populate("imageID")
    .populate("departmentID")
    .populate("roleID")
    .populate("userTypeID")

    let allUsers = await User.find({})
    .populate("imageID")
    .populate("departmentID")
    .populate("roleID")
    .populate("userTypeID")


    let mechanics = await Mechanic.find({}).populate("specialtyID")
    
    active.map(user => {
        mechanics.map(mech => {
            if (user._id.toString() == mech.userID.toString()) {
                user.set("specialtyID", mech.specialtyID, {strict: false})
            }
        })
    })

    inactive.map(user => {
        mechanics.map(mech => {
            if (user._id.toString() == mech.userID.toString()) {
                user.set("specialtyID", mech.specialtyID, {strict: false})
            }
        })
    })
    
    res.json({
        users: {
            active: active,
            inactive: inactive,
            all: allUsers
        },
        count: allUsers.length
    })
}