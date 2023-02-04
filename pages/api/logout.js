import { ironOptions } from "@/lib/config";
import { withIronSessionApiRoute } from "iron-session/next/dist";

async function logout(req, res) {
  req.session.destroy();
  res.json("Session ended");
}

export default withIronSessionApiRoute(logout, ironOptions);
