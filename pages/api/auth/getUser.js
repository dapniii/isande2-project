import { withSessionRoute } from "@/lib/auth/withSession";
// import { sessionOptions } from "lib/session";

export default withSessionRoute(getUser);

async function getUser(req, res) {

    if (req.session.user == null) {
        console.log("User not logged in")
        res.json({
            isLoggedIn: false
        })
    } 
    else {
        
        res.json({
            data: req.session.user,
            isLoggedIn: true
        })
    }
}