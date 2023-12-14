const mongoose = require("mongoose");

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
    }
  ],
  mapLicenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  privacy: { type: Boolean, required: true, default: false},
  lng: { type: Number, required: true, default: 0 },
  lat: { type: Number, required: true, default: 0 },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
