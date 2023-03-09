import { connectToDatabase } from "@/lib/db";
import User from "@/models/users/UserSchema";
import Mechanic from "@/models/users/MechanicSchema";


export default async (req, res) => {
    await connectToDatabase();

    let users = await User.find({})
    .populate("imageID")
    .populate("departmentID")
    .populate("roleID")
    .populate("userTypeID")
    .populate("creatorID")


    let mechanics = await Mechanic.find({}).populate("specialtyID")
    
    users.map(user => {
        mechanics.map(mech => {
            if (user._id.toString() == mech.userID.toString()) {
                user.specialtyID = mech.specialtyID
            }
        })
    })
    
    res.json(users)
}

    // let result = await User.aggregate([
    //     { 
    //         $lookup: {
    //             from: "mechanics", // from mechanics collection
    //             localField: "_id", // get user id from users collection
    //             foreignField: "userID", // check if it matches userID field in mechanics colection
    //             as: "mechanic", // get result as this variable name
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "specialties", // from specialties collection
    //             let: {mechanic: "$mechanic"}, // set previous mechanic result as a variable
    //             pipeline: [
    //                 {
    //                     $match: { '$expr': { '$in': ['$_id', '$$mechanic.specialtyID'] } } // just copied this code uwu
    //                 }
    //             ],
    //             as: "specialtyID" // get result as this variable name
    //         }
    //     }, 
    //     {
    //         $project: { mechanic: 0 } // remove created mechanic field from result
    //     }, 
    //     {
    //         $unwind: "$specialtyID"
    //     }

    // ])