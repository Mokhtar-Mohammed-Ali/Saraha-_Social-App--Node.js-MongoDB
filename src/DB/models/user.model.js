import  mongoose  from "mongoose";
import { GenderEnumms, ProviderEnumms } from "../../common/enumms/index.js";

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
    password: { type: String, required: true },
    phone: { type: String, required: true },
    picCover: { type: [String] },
   picprofile: { type: String },
    provider: {
      type: String,
      enum: Object.values(ProviderEnumms),
      default: ProviderEnumms.SYSTEM,
    },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
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
}

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
