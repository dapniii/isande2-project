import { connectToDatabase } from "@/lib/db";
import UserType from "@/models/users/UserTypeSchema";

export default async (req, res) => {
    await connectToDatabase();
    const userTypeInfo = req.body;

    // Insert new specialties
    userTypeInfo.additions.forEach(async element => {
        let duplicates = await UserType.find({
            $or: [ {'pubId': userTypeInfo.id}, {'name': userTypeInfo.name}]
            
        }) 
        await UserType.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
        
        
    })

    // Update existing specialties
    userTypeInfo.edits.forEach(async element => {
        let duplicates = await UserType.find({
            name: element.name
        })

        await UserType.updateOne(
            {pubId: element.pubId},
            {
                name: element.name,
                disabled: element.disabled,
            }
        )
    })

    res.json("success")

    // let duplicateID = await UserType.findOne({
    //     pubId: userTypeInfo.id,
    // })
    // let duplicateName = await UserType.findOne({
    //     name: userTypeInfo.name,
    // })

    // if (duplicateName != null || duplicateID != null) {
    //     res.json(userTypeInfo.name)
    // } else {
    //     await UserType.create(userTypeInfo);
    //     res.json("New user type created")
    // }
}