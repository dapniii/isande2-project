import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/users/UserSchema";
import Department from "@/models/users/DepartmentSchema";
import Role from "@/models/users/RoleSchema"; 
import UserType from "@/models/users/UserTypeSchema";
import Mechanic from "@/models/users/MechanicSchema";
import Image from "@/models/ImageSchema";
import Specialty from "@/models/users/SpecialtySchema";
import { genSalt, hash } from "bcryptjs";

export default async (req, res) => {
    await connectToDatabase();
    var ObjectId = mongoose.Types.ObjectId

    const bodyData = req.body;

    console.log("Edit user")
 
    let salt = await genSalt();
    let hashedPassword = await hash(bodyData.password, salt)
    bodyData.password = hashedPassword
    // Create user
    let userResult = await User.findOneAndUpdate({userID: bodyData.userID}, {
        password: bodyData.password
    });

    
    res.status(200).json(userResult)
}



