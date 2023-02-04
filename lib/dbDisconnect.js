import mongoose from "mongoose";

const dbDisconnect = async () => mongoose.connection.disconnect();

export default dbDisconnect;