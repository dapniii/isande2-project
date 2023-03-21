import mongoose from "mongoose";
import User from "@/models/users/UserSchema";
import Mechanic from "@/models/users/MechanicSchema";
import { connectToDatabase } from "@/lib/db";


export default async (req, res) => {
    await connectToDatabase();
    let userInfo = req.body

    let originalUser = await User.findOne({userID: userInfo.userID}).populate("roleID")
    let originalMechanic = await Mechanic.findOne({userID: originalUser._id})

    if (originalUser != null) {
        let userRes = await User.findByIdAndUpdate(originalUser._id, {
            disabled: !originalUser.disabled
        })

        // If user role is currently mechanic 
        if (originalMechanic != null && originalUser.roleID.name == "Mechanic") {
            let mechResult = await Mechanic.findOneAndUpdate({userID: originalUser._id}, {
                disabled: !originalUser.disabled
            })
        }
        res.status(200).json("Successfully disabled user")
    }
    else
        res.status(404).json("Cannot find user")
}