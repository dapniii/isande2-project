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
    const userInfo = req.body;
    
    // Encrypt password
    let salt = await genSalt();
    let hashedPassword = await hash(userInfo.password, salt)

    // Check duplicate userID
    let duplicateID = await User.findOne({userID: userInfo.userID})
    if (duplicateID != null) {
        res.status(400).send({ error: "User ID already exists" })  
    } else {
        // Get creator Id
        let creatorID = await User.findOne({ userID: userInfo.creatorID })
        if (creatorID == null || creatorID.disabled) 
            res.status(401).json({ error: "Creator user ID not authorized" })
        else {
            // Get deparment id
            let departmentID = await Department.findOne({name: userInfo.departmentID})

            // Get role id
            let roleID = await Role.findOne({name: userInfo.roleID})
            let isMechanic = userInfo.roleID == "Mechanic"
            
            // Get user type id
            let userTypeID = await UserType.findOne({name: userInfo.userTypeID})
            
            let specialtyID 
            // Get specialty if applicable
            if (isMechanic) 
                specialtyID = await Specialty.findOne({name: userInfo.specialtyID})
            

            // Add image details to image collection
            let imageResult
            try {
                imageResult = await Image.create({
                    secure_url: userInfo.imageID.secure_url,
                    disabled: false,
                })
            } catch(e) {
                res.status(500).json({ error: "Failed to save image" })
            }
            
            try {
                // Create user
                let userResult = await User.create({
                    userID: userInfo.userID,
                    imageID: imageResult._id,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    departmentID: departmentID._id,
                    roleID: roleID._id,
                    userTypeID: userTypeID._id,
                    password: hashedPassword,
                    creatorID: creatorID._id, 
                });

                res.status(200).json({
                    userResult,
                    msg: `Successfully created user`
                })
                
                try {
                    // If mechanic, get specialty id and insert to mechanic collection
                    let mechanicRes
                    if (isMechanic) {
                        mechanicRes = await Mechanic.create({
                            userID: userResult._id,
                            specialtyID: specialtyID._id,
                        })
                    }
                } catch(e) {
                    await Image.findByIdAndDelete(imageResult._id)
                    await User.findByIdAndDelete(userResult._id)
                    res.status(400).json({ error: "Failed to save mechanic"})
                }
                
            } catch(e) {
                await Image.findByIdAndDelete(userInfo._id)
                res.status(500).json({ error: "Failed to create user" })
            }
        }
    }
}
