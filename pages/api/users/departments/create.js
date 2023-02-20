import { connectToDatabase } from "@/lib/db";
import Department from "@/models/users/DepartmentSchema";

export default async (req, res) => {
    await connectToDatabase();
    const deptInfo = req.body;

    let duplicateID = await Department.findOne({
        pubId: deptInfo.id,
    })
    let duplicateName = await Department.findOne({
        name: deptInfo.name,
    })

    if (duplicateName != null || duplicateID != null) {
        res.json(deptInfo.name)
    } else {
        await Department.create(deptInfo);
        res.json("New department created")
    }
}