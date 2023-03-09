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
    let saltRounds = 10;

    let duplicateID = await User.findOne({userID: userInfo.userID})

    if (duplicateID != null) {
        console.log("Duplicate employee ID")
    } else {
        // Encrypt password
        let salt = await genSalt(saltRounds);
        let hashedPassword = await hash(userInfo.password, salt)
        userInfo.password = hashedPassword

        // Get creator id 
        if (userInfo.creatorID != "" || userInfo.creatorID != null) {
            let creatorObjID = await User.findOne({ userID: userInfo.creatorID })
            userInfo.creatorID = creatorObjID._id
        }
        else {
            delete userInfo.creatorID
        }


        // Get deparment id
        let deptObjID = await Department.findOne({name: userInfo.departmentID})
        userInfo.departmentID = deptObjID._id

        // // Get role id
        let roleObjID = await Role.findOne({name: userInfo.roleID})
        let isMechanic = userInfo.roleID == "Mechanic"
        userInfo.roleID = roleObjID._id

        // // Get Get user type id
        let userTypeObjID = await UserType.findOne({name: userInfo.userTypeID})
        userInfo.userTypeID = userTypeObjID._id

        // Get specialty if applicable 
        let specialtyID = await Specialty.findOne({name: userInfo.specialtyID})
        delete userInfo.specialty
        
        // Add image details to image collection
        let imageResult = await Image.create({
            secure_url: userInfo.imageID.secure_url,
            disabled: false,
        })
        userInfo.imageID = imageResult._id
        
        // Create user
        let userResult = await User.create(userInfo);

        // If mechanic, get specialty id and insert to mechanic collection
        if (isMechanic) {
            await Mechanic.create({
                userID: userResult._id,
                specialtyID: specialtyID._id,
            })
        }
        
        res.json("done")
    }
}