import { connectToDatabase } from "@/lib/db";

export default async (req, res) => {
    await connectToDatabase();
    res.json("success")
}