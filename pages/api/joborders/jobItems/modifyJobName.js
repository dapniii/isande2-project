import { connectToDatabase } from "@/lib/db";
import JobName from "@/models/jobOrders/descriptionItems/JobNameSchema";
import Specialty from "@/models/users/SpecialtySchema";

export default async (req, res) => {
    await connectToDatabase();
    const jobInfo = req.body;
    console.log(jobInfo)
    // Insert new item brands
    jobInfo.additions.forEach(async element => {
        let duplicates = await JobName.find({
            $or: [ {'jobID': jobInfo.id}, {'name': jobInfo.name}]
            
        }) 

        let specialty = await Specialty.findOne({name: element.categoryID})
        console.log(specialty)
        element.categoryID = specialty._id
        
        await JobName.create({
            jobID: element.id,
            name: element.name,
            categoryID: element.categoryID,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    jobInfo.edits.forEach(async element => {
        let duplicates = await JobName.findOne({
            name: element.name
        })

        let specialty = await Specialty.findOne({name: element.categoryID})
        element.categoryID = specialty._id

        let edit = await JobName.updateOne(
            { jobID: element.jobID },
            { 
                name: element.name,
                categoryID: element.categoryID,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}