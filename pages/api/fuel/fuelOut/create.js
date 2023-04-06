import { connectToDatabase } from "@/lib/db";
import FuelOut from "@/models/fuel/FuelOutSchema";

export default async (req, res) => {
  try {
    await connectToDatabase();
    const e = req.body;

    await FuelOut.create({
      fuelOutID: e.fuelOutID,
      oRecordDateTime: e.oRecordDateTime,
      oDriver: e.oDriver,
      oPlateNumber: e.oPlateNumber,
      ofLiters: e.ofLiters,
      oPreviousRoute: e.oPreviousRoute,
      creatorID: e.creatorID,
    });

    res.json("success");
  } catch (err) {
    console.error(err);
  }
};
