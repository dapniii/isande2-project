import { connectToDatabase } from "@/lib/db";
import User from "@/models/users/UserSchema";
import Department from "@/models/users/DepartmentSchema";
import Role from "@/models/users/RoleSchema"; 
import UserType from "@/models/users/UserTypeSchema";
import Mechanic from "@/models/users/MechanicSchema";
import Image from "@/models/ImageSchema";
import Specialty from "@/models/users/SpecialtySchema";
import { genSalt, hash } from "bcryptjs";
import { customAlphabet } from "nanoid";
import numbers from "nanoid-dictionary/numbers";

export default async (req, res) => {
    await connectToDatabase();
    const userInfo = req.body;
    const nanoid = customAlphabet(numbers, 8) // id generator

    // Encrypt password
    let salt = await genSalt();
    let hashedPassword = await hash(userInfo.password, salt)
    userInfo.password = hashedPassword

    // Check duplicate userID
    let duplicateID = await User.findOne({userID: userInfo.userID})
    if (duplicateID != null) {
        console.log("Duplicate ID found")
        res.status(400).json({ error: "User ID already exists" })  
    }
        

    // Get creator Id
    // let creatorObjID = await User.findOne({ userID: userInfo.creatorID })
    // if (creatorObjID == null || creatorObjID.disabled) {
 
    //     res.status(401).json({ error: "Creator user ID not authorized" })
    // } 
    // userInfo.creatorID = creatorObjID._id
    
    // Get deparment id
    let deptObjID = await Department.findOne({name: userInfo.departmentID})
    if (deptObjID == null) 
        res.status(404).json({ error: "Department not found" })
    else if (deptObjID.disabled) 
        res.status(400).json({ error: "Department not valid"})
    userInfo.departmentID = deptObjID._id
    
    // Get role id
    let roleObjID = await Role.findOne({name: userInfo.roleID})
    if (roleObjID == null) 
        res.status(404).json({error: "Role not found"})
    else if (roleObjID.disabled)
        res.status(400).json({ error: "Role not valid"})
    let isMechanic = userInfo.roleID == "Mechanic"
    userInfo.roleID = roleObjID._id
    

    // Get user type id
    let userTypeObjID = await UserType.findOne({name: userInfo.userTypeID})
    if (userTypeObjID == null) 
        res.status(404).json({ error: "User Type not found" })
    else if (userTypeObjID.disabled)
        res.status(400).json({ error: "User Type not valid" })
    userInfo.userTypeID = userTypeObjID._id
    
    // Get specialty if applicable
    if (isMechanic) {
        let specialtyID = await Specialty.findOne({name: userInfo.specialtyID})
        if (specialtyID == null) 
            res.status(404).json({ error: "Specialty not found"})
        else if (specialtyID.disabled) 
            res.status(400).json({ error: "Specialty not valid" })
        userInfo.specialtyID == specialtyID._id
    }
 
    // Add image details to image collection
    let imageResult = await Image.create({
        secure_url: userInfo.imageID.secure_url,
        disabled: false,
    })
    if (imageResult == null) 
        res.status(400).json({ error: "Failed to save image" })
    userInfo.imageID = imageResult._id
    
    // Create user
    let userResult = await User.create(userInfo);
    if (userResult == null) {
        // Delete image from the db
        await Image.findByIdAndDelete(userInfo._id)
        res.status(400).json({ error: "Failed to save user"})
    }
        

    // If mechanic, get specialty id and insert to mechanic collection
    if (isMechanic) {
        let mechanicRes = await Mechanic.create({
            userID: userResult._id,
            specialtyID: specialtyID._id,
        })
        if (mechanicRes == null)
            // Delete image from the db
            await Image.findByIdAndDelete(userInfo._id)
            await User.findByIdAndDelete(userResult._id)
            res.status(400).json({ error: "Failed to save mechanic"})
    }
    
    res.status(200).json({
        userResult,
        msg: `Successfully created user`
    })
}
