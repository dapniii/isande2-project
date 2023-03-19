import { connectToDatabase } from "@/lib/db";
import JobItem from "@/models/jobOrders/descriptionItems/JobItemSchema";
import JobName from "@/models/jobOrders/descriptionItems/JobNameSchema";
import Item from "@/models/spareParts/ItemSchema";

export default async (req, res) => {
    await connectToDatabase();

    let newJoItem = req.body

    let job = await JobName.findOne({
        name: newJoItem.jobID
    })

    let item = await Item.findOne({
        itemName: newJoItem.itemName,
        itemModel: newJoItem.itemModel,
    })
    
    let joItemResult = await JobItem.create({
        jobID: job._id,
        itemID: item._id,
        recommendedQty: newJoItem.recommendedQty,
        description: newJoItem.description
    })

    res.json(joItemResult)
}
