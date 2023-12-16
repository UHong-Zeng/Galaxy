"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
        {
          path: "likedBy",
          model: User,
          select: "_id id name image",
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}

export async function isLikePost(userId: string, postId: string) {
  try {
    const user = await User.findOne({ id: userId });

    if (user.likes.includes(postId)) return true;
    else return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function toggleLike(
  userId: string,
  postId: string,
  isLike: boolean
) {
  try {
    let currentLike = isLike;
    const user = await User.findOne({ id: userId });

    if (currentLike) {
      await User.findOneAndUpdate({ id: userId }, { $pull: { likes: postId } });
      await Thread.findByIdAndUpdate(postId, { $pull: { likedBy: user._id } });
      currentLike = false;
    } else {
      await User.findOneAndUpdate({ id: userId }, { $push: { likes: postId } });
      await Thread.findByIdAndUpdate(postId, { $push: { likedBy: user._id } });
      currentLike = true;
    }

    return currentLike;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function changeOnboarded(userId: string) {
  connectToDB();
  try {
    await User.findOneAndUpdate({ id: userId }, { $set: { onboarded: false } });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updatePosition(userId: string, lng: number, lat: number) {
  try {
    await connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      { $set: { lng: lng, lat: lat } }
    );
  } catch (error: any) {}
}

export async function togglePrivacy(userId: string, isPrivate: boolean) {
  try {
    console.log(!isPrivate);
    await connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      { $set: { privacy: !isPrivate } }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getPrivacy(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId }).select("privacy");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function addUserToLicense(userId: string, target: string) {
  try {
    await connectToDB();

    const targetUser = await User.findOne({
      $or: [{ name: target }, { username: target }],
    });

    if (targetUser === null) return null;

    const result = await User.findOneAndUpdate(
      { id: userId },
      { $addToSet: { mapLicenses: targetUser._id } }
      // { new: true }
    );
    return result.mapLicenses;
  } catch (error: any) {}
}

export async function fetchLicense(userId: string) {
  try {
    await connectToDB();
    const targets = await User.findOne({ id: userId }).select("mapLicenses");

    const users = await User.find({
      _id: { $in: targets.mapLicenses },
    }).select("name username image _id");

    return users;
  } catch (error: any) {}
}

export async function deleteLicense(userId: string, id: string) {
  try {
    await connectToDB();
    const result = await User.findOne({ id: userId });
    console.log(result.mapLicenses);
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        $pull: { mapLicenses: id },
      }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}
