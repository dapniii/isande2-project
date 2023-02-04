import { verifyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/dbConnect";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  //Login backend
  providers: [
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials) {
        const client = await connectToDatabase();

        //Connect to users db
        const usersCollection = client.db().collection("users");

        //Check if user's employee ID is in the db
        const user = await usersCollection.findOne({
          employeeID: credentials.employeeID,
        });
        //If not in db, return error
        if (!user) {
          client.close();
          throw new Error("User not found");
        }

        //Verify if password matches one in db
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        //If password does not match, return error
        if (!isValid) {
          client.close();
          throw new Error("Invalid Password");
        }
        //Login details successful, close connection
        //and pass employee ID as part of session
        client.close();
        return { employeeID: credentials.employeeID };
      },
    }),
  ],
});
