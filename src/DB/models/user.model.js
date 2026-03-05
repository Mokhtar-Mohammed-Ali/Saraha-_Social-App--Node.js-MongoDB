import mongoose from "mongoose";
import {
  GenderEnumms,
  ProviderEnumms,
  RoleEnumms,
} from "../../common/enums/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "first name must be at least 3 characters"],
      maxLength: [20, "first name must be less than 20 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "last name must be at least 3 characters"],
      maxLength: [20, "last name must be less than 20 characters"],
      trim: true,
    },
    email: { type: String, required: true, unique: true },
    confirmEmail: { type: Date },
    changeCredentialsTime: { type: Date },
    gender: {
      type: Number,
      enum: Object.values(GenderEnumms),
      default: GenderEnumms.Male,
    },
    password: { type: String,  required: function () { return this.provider == ProviderEnumms.SYSTEM; } },
    // phone: { type: String, required: true },
    phone: { 
  type: String, 
  required: function () { return this.provider == ProviderEnumms.SYSTEM; } 
},
    profilePicCover: { type: [String] },
    profilePic: { type: String },
    profileGallery: {type:[String]},
    provider: {
      type: Number,
      enum: Object.values(ProviderEnumms),
      default: ProviderEnumms.SYSTEM,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnumms),
      default: RoleEnumms.User,
    },
  },
  {
    timestamps: true,
    collection: "SARAHA_USERS",
    validateBeforeSave: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true,
    autoIndex: true,
  },
);
userSchema
  .virtual("userName")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });
export const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);
