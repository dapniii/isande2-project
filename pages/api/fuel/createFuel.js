import { connectToDatabase } from "@/lib/db";
import FuelIn from "@/models/fuel/FuelInSchema";
import FuelOut from "@/models/fuel/FuelOutSchema";
import RefuelType from "@/models/fuel/RefuelTypeSchema";


export default async (req, res) => {
    await connectToDatabase();

    const fuelEntryInfo = req.body;

    
    if (fuelEntryInfo.fuelIn == true) {
        let duplicateFuelInID = await FuelIn.findOne({fuelInID: fuelEntryInfo.fuelInID})
        if (duplicateFuelInID != null) {
            console.log("Duplicate fuel in entry ID")
            res.status(400).json({ error: "Duplicate fuel in entry ID" })
        } else {
            
            // //Get creator id
            // if(fuelEntryInfo.creatorID != "" || fuelEntryInfo.creatorID != null) {
            //     let creatorObjID = await FuelIn.findOne({ userID: fuelEntryInfo.creatorID })
            //     fuelEntryInfo.creatorID = creatorObjID._id;
            // }
            // else{
            //     delete fuelEntryInfo.creatorID
            // }

            let fuelInTypeResult = await RefuelType.create({name:fuelEntryInfo.name, disabled: false})
            fuelEntryInfo.fuelTypeID = fuelInTypeResult._id

            //Get date time
            let fRecordDateTime = await FuelIn.findOne({recordDateTime: fuelEntryInfo.fRecordDateTime}).lean()
            fuelEntryInfo.recordDateTime = fRecordDateTime

            let fUnitPrice = await FuelIn.findOne({unitPrice: fuelEntryInfo.unitPrice}).lean()
            fuelEntryInfo.unitPrice = fUnitPrice

            // let userObjID = await FuelIn.findOne({ userID: fuelEntryInfo.userID}).lean()
            // fuelEntryInfo.userID = userObjID._id

            let fLiters = await FuelIn.findOne({ liters: fuelEntryInfo.fLiters}).lean()
            fuelEntryInfo.liters = fLiters
            
            let fFuelIn = await FuelIn.findOne({ fuelIn: fuelEntryInfo.fFuelIn}).lean()
            fuelEntryInfo.fuelIn = fFuelIn

            let fFuelInPercent = await FuelIn.findOne({ fuelInPercent: fuelEntryInfo.fuelInPercent}).lean()
            fuelEntryInfo.fuelInPercent = fFuelInPercent
            
            let fuelInResult = await FuelIn.create(fuelEntryInfo);

            res.status(200).json({fuelInResult, message: `Successfully created fuel entry`})
        }
        
    }

    else {
        let duplicateFuelOutID = await FuelOut.findOne({fuelOutID: fuelEntryInfo.fuelOutID})
        if (duplicateFuelOutID != null) {
            console.log("Duplicate fuel out entry ID")
            res.status(400).json({ error: "Duplicate fuel out entry ID"})
        } else {
            
            //  //Get creator id
            // if(fuelEntryInfo.creatorID != "" || fuelEntryInfo.creatorID != null) {
            //     let creatorObjID = await FuelOut.findOne({ userID: fuelEntryInfo.creatorID })
            //     fuelEntryInfo.creatorID = creatorObjID._id;
            // }
            // else{
            //     delete fuelEntryInfo.creatorID
            // }
            let fuelOutTypeResult = await RefuelType.create({name:fuelEntryInfo.name, disabled: false})
            fuelEntryInfo.fuelTypeID = fuelOutTypeResult._id

             //Get date time
             let oRecordDateTime = await FuelOut.findOne({recordDateTime: fuelEntryInfo.oRecordDateTime}).lean()
             fuelEntryInfo.recordDateTime = oRecordDateTime
            
             let oDriverId = await FuelOut.findOne({driverID: fuelEntryInfo.oDriverID })
             fuelEntryInfo.driverID = oDriverId._id

             let userObjID = await FuelOut.findOne({ userID: fuelEntryInfo.oUserID}).lean()
             fuelEntryInfo.userID = userObjID._id

             let oPlateNumber = await FuelOut.findOne({ plateNumber: fuelEntryInfo.plateNumber}).lean()
             fuelEntryInfo.plateNumber = oPlateNumber
 
             let oLiters = await FuelOut.findOne({ liters: fuelEntryInfo.oLiters}).lean()
             fuelEntryInfo.liters = oLiters
             
             let oFuelOut = await FuelOut.findOne({ fuelOut: fuelEntryInfo.oFuelOut}).lean()
             fuelEntryInfo.fuelOut = fFuelOut

             let oPreviousRoute = await FuelOut.findOne({ previousRoute: fuelEntryInfo.oPreviousRoute}).lean()
             fuelEntryInfo.previousRoute = oPreviousRoute
 
             let oFuelOutPercent = await FuelOut.findOne({ fuelOutPercent: fuelEntryInfo.fuelOutPercent}).lean()
             fuelEntryInfo.fuelOutPercent = fFuelOutPercent

             let fuelOutResult = await FuelOut.create(fuelEntryInfo);

            res.status(200).json({fuelOutResult, message: `Successfully created fuel entry`})

        }
    }   
}

