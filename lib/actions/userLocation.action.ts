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
