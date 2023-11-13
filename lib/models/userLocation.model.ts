import mongoose from "mongoose";

const userLocationSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    
  }
})

const UserLocation = mongoose.models.UserLocation || mongoose.model("UserLocation", userLocationSchema);

export default UserLocation;