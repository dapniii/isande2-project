import { connectToDatabase } from "@/lib/db";
import JobItem from "@/models/jobOrders/descriptionItems/JobItemSchema";
import JobName from "@/models/jobOrders/descriptionItems/JobNameSchema";
import Item from "@/models/spareParts/ItemSchema";
import Specialty from "@/models/users/SpecialtySchema";
import { generateID } from "@/lib/dataHandler";

export default async (req, res) => {
    await connectToDatabase();

    let newJoItem = req.body

    let job = await JobName.findOne({
        name: newJoItem.jobID
    })
    let numJobs = await JobName.find({})
    
    if (job == null) {
        let categoryID = await Specialty.findOne({name: newJoItem.categoryID})
        job = await JobName.create({
            jobID: generateID(numJobs.length, 10),
            name: newJoItem.name,
            categoryID: categoryID._id,
            description: newJoItem.description
        })

        newJoItem.partsList.map(async item => {
            let newJoItem = await JobItem.create({
                jobID: job._id,
                itemID: item.itemID,
                recommendedQty: parseInt(item.quantity),
            })
        })

        res.json("success")
    } 
    else res.status.json({ error: "Job name already exists" })

    
}
