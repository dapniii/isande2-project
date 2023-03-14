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
    let saltRounds = 10;

    const userInfo = await User.findOne({userID: bodyData.userID})
    if (userInfo != null) {
        if (bodyData.password != null) {
            let salt = await genSalt(saltRounds);
            let hashedPassword = await hash(bodyData.password, salt)
            bodyData.password = hashedPassword
        } else {
            bodyData.password = userInfo.password
        }
            // Get deparment id
            let deptObjID = await Department.findOne({name: bodyData.departmentID})
            bodyData.departmentID = deptObjID._id
    
            // // Get role id
            let roleObjID = await Role.findOne({name: bodyData.roleID})
            let isMechanic = bodyData.roleID == "Mechanic"
            bodyData.roleID = roleObjID._id
    
            // // Get Get user type id
            let userTypeObjID = await UserType.findOne({name: bodyData.userTypeID})
            bodyData.userTypeID = userTypeObjID._id
    
            // Get specialty if applicable 
            if (bodyData.specialtyID != null) {
                let specialtyID = await Specialty.findOne({name: bodyData.specialtyID})
                delete bodyData.specialtyID
            }
            
            // Add image details to image collection
            if (bodyData.imageID != "") {
                let imageResult = await Image.findByIdAndUpdate(userInfo.imageID,
                    {
                        secure_url: bodyData.imageID.secure_url,
                        disabled: false,
                    })
                    bodyData.imageID = imageResult._id
            }

            
            // Create user
            let userResult = await User.updateOne({userID: bodyData.userID}, {
                firstName: bodyData.firstName,
                lastName: bodyData.lastName,
                email: bodyData.email, 
                phone: bodyData.phone,
                departmentID: bodyData.departmentID,
                roleID: bodyData.roleID,
                userTypeID: bodyData.userTypeID,
                password: bodyData.password
            });
    
            // If mechanic, get specialty id and insert to mechanic collection
            if (isMechanic) {
                await Mechanic.updateOne({userID: userInfo._id}, { specialtyID: specialtyID._id})
            }
            
            res.json(userResult)
    }

}

