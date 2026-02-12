import crypto from "crypto";
import {
  generateHash,
  compareHash,
  NotFoundException,
  BadRequestException,
} from "../../common/utils/index.js";

import {
  create,
  findOne,
  deleteOne,
  findByIdAndUpdate,
} from "../../DB/index.js";

import { otpModel, userModel } from "../../DB/index.js";
import { sendEmail } from "./email.service.js";

// ---------------------
// توليد OTP وإرساله للمستخدم
// ---------------------
export const generateOTP = async ({ userId, email }) => {
  if (!userId || !email)
    throw BadRequestException({ message: "userId and email are required" });

  // 1. توليد كود عشوائي 6 أرقام
  const otpCode = crypto.randomInt(100000, 999999).toString();

  // 2. هاش للكود قبل تخزينه في الداتا بيز
  const hashedOTP = await generateHash({ plainText: otpCode });

  // 3. حفظ الكود والهكس ومدة الصلاحية (5 دقائق)
  await create({
    model: otpModel,
    data: {
      userId,
      code: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 دقائق
    },
  });

  // 4. إرسال الكود لإيميل المستخدم
  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otpCode}. It will expire in 5 minutes.`,
    html: `<p>Your OTP code is: <b>${otpCode}</b>. It will expire in 5 minutes.</p>`,
  });

  return true;
};

// ---------------------
// التحقق من OTP
// ---------------------
export const verifyOTP = async ({ userId, code }) => {
  if (!userId || !code)
    throw BadRequestException({ message: "userId and code are required" });

  // 1. البحث عن السجل في الداتا بيز
  const otpRecord = await findOne({
    model: otpModel,
    filter: { userId },
  });

  if (!otpRecord)
    throw NotFoundException({ message: "OTP expired or not found" });

  // 2. التحقق من صحة الكود
  const isMatch = await compareHash({
    plainText: code,
    hashedPassword: otpRecord.code,
  });

  if (!isMatch) throw BadRequestException({ message: "Invalid OTP" });

  // 3. تأكيد الإيميل للمستخدم
  await findByIdAndUpdate({
    model: userModel,
    id: userId,
    update: { confirmEmail: new Date() },
  });

  // 4. حذف الكود بعد التحقق
  await deleteOne({
    model: otpModel,
    filter: { _id: otpRecord._id },
  });

  return true;
};
