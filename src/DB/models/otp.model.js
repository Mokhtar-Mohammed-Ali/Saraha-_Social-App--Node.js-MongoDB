import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// time to live 5 minutes
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 });

export const otpModel =
  mongoose.models.OTP || mongoose.model("OTP", otpSchema);
