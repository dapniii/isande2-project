import { connectToDatabase } from "@/lib/db";
import UserType from "@/models/users/UserTypeSchema";

export default async (req, res) => {
    await connectToDatabase();

    let userTypeInfo = await UserType.findOne({
        pubId: req.query.id,
    });

    if (userTypeInfo == null) {
        let error = "User Type not found";
        console.log(`Error: ${error}`);
        res.json(error);
    } else {
        console.log(`Found user type ${userTypeInfo.name}`)
        res.json(userTypeInfo);
    }
}