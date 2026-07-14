console.log("Test file started");
import mongoose from "mongoose";

const uri =
  "mongodb+srv://pranjal7181_db_user:n3nDpP1w9OK1vNNz@cluster0.hrqkjjd.mongodb.net/youtube?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:");
    console.error(err);
    process.exit(1);
  });