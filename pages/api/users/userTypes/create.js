import { connectToDatabase } from "@/lib/db";
import UserType from "@/models/users/UserTypeSchema";

export default async (req, res) => {
    await connectToDatabase();
    const userTypeInfo = req.body;

    let duplicateID = await UserType.findOne({
        pubId: userTypeInfo.id,
    })
    let duplicateName = await UserType.findOne({
        name: userTypeInfo.name,
    })

    if (duplicateName != null || duplicateID != null) {
        res.json(userTypeInfo.name)
    } else {
        await UserType.create(userTypeInfo);
        res.json("New user type created")
    }
}