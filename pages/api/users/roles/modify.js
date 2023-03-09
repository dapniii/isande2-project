import { connectToDatabase } from "@/lib/db";
import Role from "@/models/users/RoleSchema"; 

export default async (req, res) => {
    await connectToDatabase();
    const roleInfo = req.body;

    // Insert new roles
    roleInfo.additions.forEach(async element => {
        let duplicates = await Role.find({
            $or: [ {'pubId': roleInfo.id}, {'name': roleInfo.name}]
            
        }) 
        await Role.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
        
        
    })

    // Update existing roles
    roleInfo.edits.forEach(async element => {
        let duplicates = await Role.find({
            name: element.name
        })

        await Role.updateOne(
            {pubId: element.pubId},
            {
                name: element.name,
                disabled: element.disabled,
            }
        )
    })

    res.json("success")
    // let duplicateID = await Role.findOne({
    //     pubId: roleInfo.id,
    // })
    // let duplicateName = await Role.findOne({
    //     name: roleInfo.name,
    // })

    // if (duplicateName != null || duplicateID != null) {
    //     res.json(roleInfo.name)
    // } else {
    //     await Role.create(roleInfo);
    //     res.json("New role created")
    // }
}