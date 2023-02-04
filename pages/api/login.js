//Backend
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User/UserSchema";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/lib/config";
import { verifyPassword } from "@/lib/auth";
import dbDisconnect from "@/lib/dbDisconnect";

//Connect to DB
dbConnect();
console.log("typeof dbConnect: ", typeof dbConnect)

async function login(req, res) {
  const { employeeID, password, disabled } = req.body;

  const user = await User.findOne({ userID: employeeID });

  let isDisabled = true;

  //If employeeID is found in db
  if (user) {
    //get employee account status (enabled/ disabled)
    isDisabled = user.get("disabled");
  }

  //If no user was found OR if found user account status is disabled
  //close db connection and return error
  if (!user || isDisabled) {
    //dbDisconnect();
    return res.json("User Not Found");
    //Otherwise get encrypted password
  } else {
    const storedPassword = user.get("password");
    //Compare inputted password with password stored in db
    const isValid = await verifyPassword(password, storedPassword);

    //If password matches, create session
    if (isValid) {
      req.session.user = {
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        roleID: user.roleID,
        typeID: user.typeID,
        departmentID: user.departmentID,
      };

      await req.session.save();
      res.json("Logged in");
      //Otherwise, close db connection and return error
    } else {
      //dbDisconnect();
      res.json("Invalid Password");
    }
  }
}

export default withIronSessionApiRoute(login, ironOptions);
