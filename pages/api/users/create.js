import { connectToDatabase } from "@/lib/db";
import User from "@/models/users/UserSchema";

export default async (req, res) => {
    await connectToDatabase();

    const userInfo = req.body;

    let duplicateID = await User.findOne({employeeID: userInfo.employeeID})

    if (duplicateID != null) {
        console.log("Duplicate employee ID")
    } else {
        await User.create(userInfo);
        res.json("created")
    }
}