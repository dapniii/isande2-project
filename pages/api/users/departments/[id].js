import { connectToDatabase } from "@/lib/db";
import Department from "@/models/users/DepartmentSchema";

export default async (req, res) => {
    await connectToDatabase();

    let deptInfo = await Department.findOne({
        pubId: req.query.id,
    });

    if (deptInfo == null) {
        let error = "Department not found";
        console.log(`Error: ${error}`);
        res.json(error);
    } else {
        console.log(`Found department ${deptInfo.name}`)
        res.json(deptInfo);
    }
}