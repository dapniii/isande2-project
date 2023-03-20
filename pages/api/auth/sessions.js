import { withSessionRoute } from "@/lib/auth/withSession";
import User from "@/models/users/UserSchema"
import { genSalt, hash, compare } from "bcryptjs";
import { verifyPassword } from "@/lib/auth/auth";

export default withSessionRoute(createSessionRoute)

async function createSessionRoute(req, res) {
    if (req.method === "POST") {
        const loginInfo = req.body;
        let user = await User.findOne({
            userID: loginInfo.userID
        })
        .populate("departmentID")
        .populate("roleID")
        .populate("userTypeID")


        if (user == null) {
            return res.status(404).json("User not found")
        }
        else if (user.disabled == true) {
            return res.status(400).json("Unauthorized request")
        }
        else {
            let correctPassword = await compare(loginInfo.password, user.password)
            if (!correctPassword) {
                return res.status(400).json("Incorrect password")
            }

            req.session.user = {
                userID: loginInfo.userID,
                firstName: user.firstName,
                lastName: user.lastName,
                department: user.departmentID.name,
                role: user.roleID.name,
                userType: user.userTypeID.name,
                isAdmin: user.userTypeID.name == "Admin"
            };
            await req.session.save();
            console.log(req.session)
            return res.status(200).json({ ok: true });
        }
        
    }
    return res.status(404).json("Request failed");
}