import mongoose from "mongoose";

const userLocationSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  privacy: {
    type: Boolean,
    require: true,
    default : false,
  },
  licenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
      // type: String,
      // required: true,
    },
  ],
});

const UserLocation =
  mongoose.models.UserLocation ||
  mongoose.model("UserLocation", userLocationSchema);

export default UserLocation;
