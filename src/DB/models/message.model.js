import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 10000,
      required: function () {
        return !this.attachments?.length;
      },
    },
    attachments: { type: [String], default: [] },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
       required: true,
    },
  },
  {
    timestamps: true,
    collection: "Saraha_Message",
  }
);

export const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);