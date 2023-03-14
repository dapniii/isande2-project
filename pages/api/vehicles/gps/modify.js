import { connectToDatabase } from "@/lib/db";
import GPS from "@/models/vehicles/GPSSchema";

export default async (req, res) => {
    await connectToDatabase();
    const gpsInfo = req.body;

    // Insert new item brands
    gpsInfo.additions.forEach(async element => {
        let duplicates = await GPS.find({
            $or: [ {'pubId': gpsInfo.id}, {'name': gpsInfo.name}]
            
        }) 
        await GPS.create({
            pubId: element.id,
            name: element.name,
            disabled: element.disabled,
        })
       
        
    })

    // Update existing item brands
    gpsInfo.edits.forEach(async element => {
        let duplicates = await GPS.findOne({
            name: element.name
        })

        let edit = await GPS.updateOne(
            { pubId: element.pubId },
            { 
                name: element.name,
                disabled: element.disabled,
            }

        )
    })

    res.json("success")
}