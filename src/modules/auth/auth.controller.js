import { Router } from "express";
import { login, signup, signupWithGmail, } from "./auth.service.js";
import { SuccessResponse } from "../../common/utils/index.js";
import { verifyOTP } from "./otp.service.js";
const router = Router();
router.post("/signup", async (req, res, next) => {
  const result = await signup(req.body);

  return SuccessResponse({
    res,
    status: 201,
    message: "Done signup",
    data: { result },
  });
});
// login
router.post("/login", async (req, res, next) => {
  const result = await login(req.body,`${req.protocol}://${req.host}`)

  return SuccessResponse({
    res,
   
    message: "Done login",
    data: { result },
  });
});


//Otp verification route

router.post("/verify-email", async (req, res, next) => {
  const result = await verifyOTP(req.body);

  return SuccessResponse({
    res,
    message: "Email verified successfully",
    data: { result },
  });
});


//sign up with gmail
router.post("/signup/gmail", async (req, res, next) => {
  const {status, credentials} = await signupWithGmail(req.body.idToken,`${req.protocol}://${req.host}`);

  return SuccessResponse({
    res,
    status: status,
    message: "Done signup",
    data: { ...credentials },
  });
});
export default router;
