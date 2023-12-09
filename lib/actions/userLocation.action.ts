"use server";

import UserLocation from "../models/userLocation.model";
import { connectToDB } from "../mongoose";

export async function updateLocationToUser({
  userId,
  lng,
  lat,
}: {
  userId: string;
  lng: number;
  lat: number;
}) {
  connectToDB();
  try {
    await UserLocation.findOneAndUpdate(
      { id: userId },
      { $set: { longitude: lng, latitude: lat } },
      { upsert: true, new: true }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getLocationFromUsers(userId: string) {
  connectToDB();
  try {
    const result = await UserLocation.find({ id: { $ne: userId } });

    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
