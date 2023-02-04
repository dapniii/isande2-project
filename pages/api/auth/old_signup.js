import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/dbConnect";

export default async function signupHandler(req, res) {
    //This function should only be excecuted for POSTING new data
    //if not a POST method, then cancel operation
    if (req.method !== "POST") {
        console.log("*** NOT A POST METHOD ***")
        return;
    }
    
    const data = req.body;

    const { employeeID, password } = data;
    // console.log("**INSIDE signup.js **")
    // console.log("empID: " + employeeID)
    // console.log("pass: " + password)

    //checks if employee id is inputed and if it is exactly 8 characters long
    if (!employeeID || !employeeID.trim().length === 8) {
        res.status(422).json({message:'Invalid Input: Invalid Employee ID'})
        return;
    }

    //checks if password is inputed and if it is at least 8 characters long
    if (!password || password.trim().length < 8) {
        res.status(422).json({message:'Invalid Input: Password is too short'})
        return;
    }
    
    const client = await connectToDatabase();

    const db = client.db();

    //Before hashing password, check if employeeID already exists to not
    //waste processing time & pawa
    const existingUser = await db.collection('users').findOne({employeeID: employeeID});
    //If user already exists dont allow POST
    if (existingUser) {
        res.status(422).json({message: "User already exist"});
        client.close();
        return
    }

    //hash password first before storing for security purposes
    const hashedPassword = await hashPassword(password);
    // console.log("hashed pass: " + hashedPassword)

    //insert the new record to db 
    const result = await db.collection('users').insertOne({
        employeeID: employeeID,
        password: hashedPassword,
    });

    res.status(201).json({message: 'Success! New User Created'})
    client.close();
}