import { connectToDatabase } from "@/lib/db";
import FuelIn from "@/models/fuel/FuelInSchema";
import moment from 'moment-timezone';
import { DateTime } from "luxon";

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
                    'fUnitCost': 1, 
                    'fLiters': 1, 
                    'creationDate': 1, 
                    'disabled': 1, 
                    'user.firstName': 1,
                    'user.lastName': 1,
                  })
                  .exec();
                  data.forEach((item) => {
                    // Parse oRecordDateTime using moment-timezone and convert to Luxon DateTime
                    const parsedDateTime = moment(item.fRecordDateTime).tz("Asia/Singapore").format();
                    item.formattedDate = DateTime.fromISO(parsedDateTime).toFormat("dd MMM yyyy, hh:mm a");
                  });
                  
            res.json({data});
            break;
        }

        default: {
            res.status(405).send('invalid method! only allowed GET')
        }
    }
}
