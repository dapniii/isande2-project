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


    // if (req.session.user) {
    // // in a real world application you might read the user id from the session and then do a database request
    // // to get more information on the user if needed
    // console.log(req.session.user)
    //     res.json({
    //         ...req.session.user,
    //         isLoggedIn: true,
    //     });
    // } else {
    //     res.json({
    //         isLoggedIn: false,
    //     });
    // }
}