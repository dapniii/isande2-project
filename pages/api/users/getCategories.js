import { connectToDatabase } from "@/lib/db";
import Department from "@/models/users/DepartmentSchema";
import Role from "@/models/users/RoleSchema";
import Specialty from "@/models/users/SpecialtySchema";
import UserType from "@/models/users/UserTypeSchema";

export default async (req, res) => {
    await connectToDatabase();

    let departments = await Department.find({})
    let roles = await Role.find({})
    let specialties = await Specialty.find({})
    let userTypes = await UserType.find({})

    res.json({
        departments,
        roles,
        specialties,
        userTypes
    })
}