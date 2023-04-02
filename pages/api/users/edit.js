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
            if (departmentID._id.toString() != originalUser.departmentID.toString())
                newUser["departmentID"] = departmentID._id
            if (roleID._id.toString() != originalUser.roleID.toString())
                newUser["roleID"] = roleID._id
            if (userTypeID._id.toString() != originalUser.userTypeID.toString())
                newUser["userTypeID"] = userTypeID._id
            if (bodyData.disabled != null)
                newUser["disabled"] = bodyData.disabled 
            
        
            try {
                let specialtyID = await Specialty.findOne({name: bodyData.specialtyID})
                let originalMechanic = await Mechanic.findOne({
                    userID: originalUser._id
                })
                // If user wasn't a mechanic originally but was updated to be so, add them to mechanic collection
                if (originalMechanic == null && isMechanic) {
                    let mechResult = await Mechanic.create({
                        userID: originalUser._id,
                        specialtyID: specialtyID._id
                    })
                    console.log("Employee was recently reassigned a mechanic role")
                }
                // If mechanic specialty was changed
                else if (originalMechanic.specialtyID.toString() != specialtyID._id.toString() && isMechanic) {
                    let updatedMech = await Mechanic.findByIdAndUpdate(originalMechanic._id, {
                        specialtyID: specialtyID._id,
                    })
                    console.log("Updated specialty")
                }
                // If user was originally a mechanic but was changed to something else
                else if (originalMechanic != null && !isMechanic || bodyData.disabled == true) {
                    await Mechanic.findByIdAndUpdate(originalMechanic._id, {
                        disabled: true
                    })
                    console.log("Mechanic was disabled")
                }
                // If user was originally a mechanic, changed to something else, then reverted back
                else if (originalMechanic.disabled == true && isMechanic) {
                    await Mechanic.findByIdAndUpdate(originalMechanic._id, {
                        disabled: false
                    })
                    console.log("Mechanic was disabled")
                }
            } catch(e) {
                
            }

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



