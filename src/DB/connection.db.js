import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";
import { userModel } from "./models/user.model.js";

export const connectionDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("connected successfully ✅");

    await userModel.syncIndexes();
  } catch (error) {
    console.log("failed to connect ❌", error);
  }
};
