import { createClient } from "redis";
import { REDI_URI } from "../../config/config.service.js";
export const redisClient = createClient({
  url: REDI_URI,
});
export const redisConnection = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.log("Redis Client Error", error);
  }
};
