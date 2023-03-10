import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import User from "@/models/users/UserSchema";
import Mechanic from "@/models/users/MechanicSchema";

export default async (req, res) => {
    await connectToDatabase()
    var ObjectId = mongoose.Types.ObjectId

    let userInfo = await User.findOne({
        userID: req.query.userID
    })
    .populate("imageID")
    .populate("departmentID")
    .populate("roleID")
    .populate("userTypeID")

    let mechanicInfo = await Mechanic.findOne({userID: ObjectId(userInfo._id)}).populate("specialtyID")
    userInfo.set("specialtyID", mechanicInfo.specialtyID, {strict: false})
    

    if (userInfo == null) {
        let error = "User not found";
        console.log(`Error: ${error}`);
        res.json(error);
    } else {
        console.log(`Found user ${userInfo.userID}`)
        res.json(userInfo);
    }
}