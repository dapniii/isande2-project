import { connectToDatabase } from "@/lib/dbConnect";
import { verifyPassword } from "@/lib/auth";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const { employeeID, password } = req.body;

    // get user from database then:
    const client = await connectToDatabase();
    //Connect to users db
    const usersCollection = client.db().collection("users");

    //Check if user's employee ID is in the db
    const user = await usersCollection.findOne({
      employeeID: employeeID,
    });
    //If not in db, return error
    if (!user) {
      client.close();
      throw new Error("User not found");
    }

    //Verify if password matches one in db
    const isValid = await verifyPassword(password, user.password);
    //If password does not match, return error
    if (!isValid) {
      client.close();
      throw new Error("Invalid Password");
    }
    //Login details successful, close connection
    //and pass employee ID as part of session
    client.close();
    if (user && isValid) {
      req.session.user = {
        employeeID: user.employeeID,
        admin: true,
      };
      await req.session.save();
      res.json("Logged in");
    } else {
      res.json("AUTH ERROR");
    }
  }

  //*** Y E E T ***
  //   {
  //     cookieName: "myapp_cookiename",
  //     password: "complex_password_at_least_32_characters_long",
  //     // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  //     cookieOptions: {
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
);
