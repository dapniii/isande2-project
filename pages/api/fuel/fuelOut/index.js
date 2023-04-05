import { connectToDatabase } from "@/lib/db";
import FuelOut from "@/models/fuel/FuelOutSchema";

export default async (req, res) => {
    switch(req.method) {
        case 'GET': {
            await connectToDatabase();
            const data = await FuelOut.aggregate()
            .lookup({
                'from': 'users', 
                'localField': 'creatorID', 
                'foreignField': 'userID', 
                'as': 'user'
              })
              .unwind('$user')
              .project({
                'fuelOutID': 1, 
                'oRecordDateTime': 1, 
                'oUnitCost': 1, 
                'ofLiters': 1, 
                'creationDate': 1, 
                'disabled': 1, 
                'user.firstName': 1,
                'user.lastName': 1,
              })
        res.json({data});
        break
    }

        default: {
            res.status(405).send('invalid method! only allowed GET')
        }
    }
}