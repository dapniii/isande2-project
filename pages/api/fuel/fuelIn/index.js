import { connectToDatabase } from "@/lib/db";
import FuelIn from "@/models/fuel/FuelInSchema";

export default async (req, res) => {
    switch(req.method) {
        case 'GET': {
            await connectToDatabase();
            const data = await FuelIn.aggregate()
                .lookup({
                    'from': 'users', 
                    'localField': 'creatorID', 
                    'foreignField': 'userID', 
                    'as': 'user'
                  })
                  .unwind('$user')
                  .project({
                    'fuelInID': 1, 
                    'fRecordDateTime': 1, 
                    formattedDate: { $dateToString: { format: "%d %m %Y, %H:%M ", date: "$fRecordDateTime" } },
                    'fUnitCost': 1, 
                    'fLiters': 1, 
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