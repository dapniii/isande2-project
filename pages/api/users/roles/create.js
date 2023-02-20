import { connectToDatabase } from "@/lib/db";
import Role from "@/models/users/RoleSchema"; 

export default async (req, res) => {
    await connectToDatabase();
    const roleInfo = req.body;

    let duplicateID = await Role.findOne({
        pubId: roleInfo.id,
    })
    let duplicateName = await Role.findOne({
        name: roleInfo.name,
    })

    if (duplicateName != null || duplicateID != null) {
        res.json(roleInfo.name)
    } else {
        await Role.create(roleInfo);
        res.json("New role created")
    }
}