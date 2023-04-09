import { connectToDatabase } from "@/lib/db";
import FuelOut from "@/models/fuel/FuelOutSchema";
import Vehicle from "@/models/vehicles/VehicleSchema";

export default async (req, res) => {
  try {
    await connectToDatabase();
    const e = req.body;

    console.log(e)

    let vehicleID = await Vehicle.findOne({
      plateNumber: e.oPlateNumber
  })
    await FuelOut.create({
      fuelOutID: e.fuelOutID,
      oRecordDateTime: e.oRecordDateTime,
      oDriver: e.oDriver,
      oPlateNumber: vehicleID._id,
      ofLiters: e.ofLiters,
      oPreviousRoute: e.oPreviousRoute,
      creatorID: e.creatorID,
    });

    res.json("success");
  } catch (err) {
    console.error(err);
  }
};
