import { connectToDatabase } from "@/lib/db";
import FuelOut from "@/models/fuel/FuelOutSchema";
import moment from 'moment-timezone';

export default async (req, res) => {
  switch (req.method) {
    case "GET": {
      await connectToDatabase();
      const data = await FuelOut.aggregate()
        .lookup({
          from: "users",
          localField: "creatorID",
          foreignField: "userID",
          as: "user",
        })
        .lookup({
          from: 'vehicles',
          localField: 'oPlateNumber',
          foreignField: '_id',
          as: 'oPlateNumber'
        })
        .unwind('$oPlateNumber')
        .unwind("$user")
        .project({
          fuelOutID: 1,
          oRecordDateTime: 1,
          formattedDate: {
            $dateToString: {
              format: "%Y-%m-%d, %H:%M",
              date: {
                $toDate: { $add: ["$oRecordDateTime", 8 * 60 * 60 * 1000] },
              },
            },
          },
          oDriver: 1,
          oPlateNumber: '$oPlateNumber.plateNumber',
          ofLiters: 1,
          oPreviousRoute: 1,
          creationDate: 1,
          disabled: 1,
          "user.firstName": 1,
          "user.lastName": 1,
        })
        .exec();
      data.forEach((item) => {
        item.formattedDate = moment(item.formattedDate)
          .tz("Asia/Singapore")
          .format("DD MMM YYYY, hh:mm A");
      });
      console.log(data)
      res.json({ data });
      break;
    }

    default: {
      res.status(405).send("invalid method! only allowed GET");
    }
  }
};
