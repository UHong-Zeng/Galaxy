import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if(!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
  if(isConnected) {
    console.log("Already connected.")
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;

    console.log("Connected to DB.");
    
  } catch(error) {
    console.log(error);
  }
};
