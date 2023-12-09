import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  onboarded: { type: Boolean, default: false },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  location: { //longitude first, and then latitude.
    type: {
      type: String,
      enum: ['Point'], // 指定类型为Point
      required: true
    },
    coordinates: {
      type: [Number], // 数组包含经度和纬度
      required: true
    }
  }
});

userSchema.index({location: "2dsphere"});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
