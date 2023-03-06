import { connectToDatabase } from "@/lib/db";
import User from "@/models/users/UserSchema";
import { genSalt, hash } from "bcryptjs";

export default async (req, res) => {
    await connectToDatabase();

    const userInfo = req.body;
    let saltRounds = 10;

    let duplicateID = await User.findOne({employeeID: userInfo.employeeID})

    if (duplicateID != null) {
        console.log("Duplicate employee ID")
    } else {
        let salt = await genSalt(saltRounds);
        let hashedPassword = await hash(userInfo.password, salt)
        userInfo.password = hashedPassword
        await User.create(userInfo);
        res.json("created")
    }
}