"use server";

import User from "../models/user.model";
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

export async function getPrivacyState(userId: string) {
  await connectToDB(); // 建立與數據庫的連接

  try {
    const userLocation = await UserLocation.findOne({ id: userId }).select(
      "privacy"
    ); // 使用 select 方法只選擇 privacy 屬性
    if (userLocation) {
      return userLocation.privacy; // 返回 privacy 屬性的值
    } else {
      return null; // 如果找不到對應的文檔，返回 null 或其他適當的值
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function togglePrivacy(userId: string, state: boolean) {
  connectToDB();
  try {
    await UserLocation.findOneAndUpdate(
      { id: userId },
      { $set: { privacy: state } }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function addUserLocationLicense(userId: string, target: string) {
  connectToDB();
  try {
    let user: any = await User.findOne({
      $or: [
        { name: target }, // 使用name字段篩選
        { username: target }, // 使用username字段篩選
      ],
    }).select("_id");

    // console.log(user);

    if (!user) {
      // console.log("找不到對應的用戶");
      return;
    }

    const lic = await UserLocation.findOneAndUpdate(
      { id: userId },
      { $addToSet: { licenses: user._id } }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function fetchUsersLocationLicense(userId: string) {
  await connectToDB();
  try {
    const users = await UserLocation.findOne({ id: userId })
    // .populate(
    //   {
    //     path: "licenses",
    //     model: "User",
    //     select: "_id username name",
    //   }
    // )

    const names = await Promise.all(users.licenses.map(async (result: any) => {
      return await User.findById(result).select("name");
    }));
    
    // console.log(users.licenses);
    // console.log("Type: ", typeof users.licenses)
    console.log("Names: ", names);
    console.log("Type: ", typeof names);
    // console.log("Name: ", names)

    return names;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export async function removeUserLocationLicense(
  userId: string,
  target: string
) {}
