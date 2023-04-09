import { connectToDatabase } from "@/lib/db";
import FuelIn from "@/models/fuel/FuelInSchema";
import moment from 'moment-timezone';

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
                    formattedDate: { $dateToString: { format: "%Y-%m-%d, %H:%M", date: { $toDate: { $add: [ "$fRecordDateTime", 8 * 60 * 60 * 1000 ] } } } },
                    'fUnitCost': 1, 
                    'fLiters': 1, 
                    'creationDate': 1, 
                    'disabled': 1, 
                    'user.firstName': 1,
                    'user.lastName': 1,
                  })
                  .exec();
            data.forEach((item) => {
              item.formattedDate = moment(item.formattedDate).tz('Asia/Singapore').format('DD MMM YYYY, hh:mm A');
            });
            res.json({data});
            break;
        }

        default: {
            res.status(405).send('invalid method! only allowed GET')
        }
    }
}
