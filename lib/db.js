import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://FANONGSANTAN:TNNBDvfEJi309YrW@cluster0.5w2heng.mongodb.net/?retryWrites=true&w=majority"
  );

  return client;
}
