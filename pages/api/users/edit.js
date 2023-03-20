import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/users/UserSchema";
import Department from "@/models/users/DepartmentSchema";
import Role from "@/models/users/RoleSchema"; 
import UserType from "@/models/users/UserTypeSchema";
import Mechanic from "@/models/users/MechanicSchema";
import Image from "@/models/ImageSchema";
import Specialty from "@/models/users/SpecialtySchema";
import { genSalt, hash, compare } from "bcryptjs";

export default async (req, res) => {
    await connectToDatabase();
    var ObjectId = mongoose.Types.ObjectId
    const bodyData = req.body;
    
    let originalUser = await User.findOne({userID: bodyData.userID})
    if (originalUser != null) {

        // Get deparment id
        let departmentID = await Department.findOne({name: bodyData.departmentID})

        // Get role id
        let roleID = await Role.findOne({name: bodyData.roleID})
        let isMechanic = bodyData.roleID == "Mechanic"
        
        // Get user type id
        let userTypeID = await UserType.findOne({name: bodyData.userTypeID})
        
        let specialtyID 
        // Get specialty if applicable
        if (isMechanic) 
            specialtyID = await Specialty.findOne({name: bodyData.specialtyID})

        let imageResult 
        try {
            imageResult = await Image.findByIdAndUpdate(originalUser.imageID, {
                secure_url: bodyData.imageID.secure_url,
                disabled: false,
            })
        } 
        catch(e) {}
        finally {
            let newUser = {}

            let samePassword = await compare(bodyData.password, originalUser.password)
            let hashedPassword
            if (!samePassword) {
                let salt = await genSalt();
                hashedPassword = await hash(bodyData.password, salt)
                newUser["password"] = hashedPassword
            }
            if (bodyData.firstName != originalUser.firstName)
                newUser["firstName"] = bodyData.firstName
            if (bodyData.lastName != originalUser.lastName)
                newUser["lastName"] = bodyData.lastName
            if (bodyData.email != originalUser.email)
                newUser["email"] = bodyData.email
            if (bodyData.phone != originalUser.phone)
                newUser["phone"] = bodyData.phone
            if (departmentID._id != originalUser.departmentID)
                newUser["departmentID"] = departmentID._id
            if (roleID._id != originalUser.roleID)
                newUser["roleID"] = roleID._id
            if (userTypeID._id != originalUser.userTypeID)
                newUser["userTypeID"] = userTypeID._id
            
            let originalMechanic 
            if (isMechanic) {
                originalMechanic = await Mechanic.findOne({
                    userID: originalUser._id
                })
                if (originalMechanic == null) {
                    let mechResult = await Mechanic.create({
                        userID: originalUser._id,
                        specialtyID: specialtyID._id
                    })
                }
                else if (originalMechanic.specialtyID != specialtyID._id) {
                    
                }
            }
                newUser["specialtyID"] = specialtyID._id
            console.log(newUser)
            // Update user
            try {
                let userResult = await User.findOneAndUpdate({userID: bodyData.userID}, newUser);
                res.status(200).json({
                    updatedUser: userResult,
                    msg: "Successfuly updated user"
                })
            } catch(e) {
                res.status(400).json({ error: "User not updated" })
            }
            
        }
    } 
    else
        res.status(404).json({ error: "Cannot find user" })
}



