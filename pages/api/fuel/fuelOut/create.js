import { connectToDatabase } from "@/lib/db";
import FuelOut from "@/models/fuel/FuelInSchema";

export default async (req, res) => {
  try {
    await connectToDatabase();
    const e = req.body;

    await FuelOut.create({
      fuelOutID: e.fuelOutID,
      recordDateTime: e.oRecordDateTime,
      driverID: e.oDriver,
      plateNumber: e.oPlateNumber,
      liters: e.ofLiters,
      previousRoute: e.oPreviousRoute,
      creatorID: e.creatorID,
    });

    res.json("success");
  } catch (err) {
    console.error(err);
  }
};
