import { connectToDatabase } from "@/lib/db";
import PurchaseOrder from "@/models/purchaseOrders/PurchaseOrderSchema";
import PurchaseOrderFile from "@/models/purchaseOrders/PurchaseOrderFileSchema";
import User from "@/models/users/UserSchema";

export default async (req, res) => {
    await connectToDatabase();

    const poInfo = req.body;
    console.log(poInfo)

    res.json("success")
}

