import { connectToDatabase } from "@/lib/db";
import FuelOut from "@/models/fuel/FuelOutSchema";
import moment from 'moment-timezone';
import { DateTime } from "luxon";

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
        // Parse oRecordDateTime using moment-timezone and convert to Luxon DateTime
        const parsedDateTime = moment(item.oRecordDateTime).tz("Asia/Singapore").format();
        item.formattedDate = DateTime.fromISO(parsedDateTime).toFormat("dd MMM yyyy, hh:mm a");
      });

      res.json({ data });
      break;
    }

    default: {
      res.status(405).send("invalid method! only allowed GET");
    }
  }
};
