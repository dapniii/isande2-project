import { connectToDatabase } from "@/lib/db";
import Specialty from "@/models/users/SpecialtySchema";

export default async (req, res) => {
    await connectToDatabase();
    const specialtyInfo = req.body;

    // Insert new specialties
    specialtyInfo.additions.forEach(async element => {
        let duplicates = await Specialty.find({
            $or: [ {'pubId': specialtyInfo.id}, {'name': specialtyInfo.name}]
            
        }) 
        await Specialty.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
        
        
    })

    // Update existing specialties
    specialtyInfo.edits.forEach(async element => {
        let duplicates = await Specialty.find({
            name: element.name
        })

        await Specialty.updateOne(
            {pubId: element.pubId},
            {
                name: element.name,
                disabled: element.disabled,
            }
        )
    })

    res.json("success")

    // let duplicateID = await Specialty.findOne({
    //     pubId: specialtyInfo.id,
    // })
    // let duplicateName = await Specialty.findOne({
    //     name: specialtyInfo.name,
    // })

    // if (duplicateName != null || duplicateID != null) {
    //     res.json(specialtyInfo.name)
    // } else {
    //     await Specialty.create(specialtyInfo);
    //     res.json("New mechanic specialty created")
    // }
}