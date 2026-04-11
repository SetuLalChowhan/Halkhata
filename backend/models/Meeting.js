const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    roomName: { type: String, required: true, unique: true },
    scheduledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed"],
      default: "scheduled",
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
    summary: { type: String, default: "" },
    duration: { type: Number, default: 0 }, // in minutes
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
