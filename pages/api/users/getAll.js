import { connectToDatabase } from "@/lib/db";
import User from "@/models/users/UserSchema";

export default async (req, res) => {
    await connectToDatabase();

    let users = await User.find({},)

    res.json(users)
}