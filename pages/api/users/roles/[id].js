import { connectToDatabase } from "@/lib/db";
import Role from "@/models/users/RoleSchema"; 

export default async (req, res) => {
    await connectToDatabase();

    let roleInfo = await Role.findOne({
        pubId: req.query.id,
    });

    if (roleInfo == null) {
        let error = "Role not found";
        console.log(`Error: ${error}`);
        res.json(error);
    } else {
        console.log(`Found role ${roleInfo.name}`)
        res.json(roleInfo);
    }
}