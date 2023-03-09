import { connectToDatabase } from "@/lib/db";
import Department from "@/models/users/DepartmentSchema";
import { nanoid } from "nanoid";

export default async (req, res) => {
    await connectToDatabase();
    const deptInfo = req.body;

    // Insert new departments
    deptInfo.additions.forEach(async element => {
        let duplicates = await Department.find({
            $or: [ {'pubId': deptInfo.id}, {'name': deptInfo.name}]
            
        }) 
        await Department.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing departments
    deptInfo.edits.forEach(async element => {
        let duplicates = await Department.findOne({
            name: element.name
        })

        let edit = await Department.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
        console.log(edit)
    })

    res.json("success")
    // deptInfo.forEach(async element => {
    //     let duplicateID = await Department.findOne({
    //         pubId: deptInfo.id,
    //     })
    //     let duplicateName = await Department.findOne({
    //         name: deptInfo.name,
    //     })
    // });

    
    // let duplicateID = await Department.findOne({
    //     pubId: deptInfo.id,
    // })
    // let duplicateName = await Department.findOne({
    //     name: deptInfo.name,
    // })

    // if (duplicateName != null || duplicateID != null) {
    //     res.json(deptInfo.name)
    // } else {
    //     await Department.updateOne(deptInfo);
    //     res.json("New department created")
    // }
}