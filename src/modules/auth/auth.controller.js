import { Router } from "express";
import { confirmEmail, login, resendConfirmEmail, signup, signupWithGmail, } from "./auth.service.js";
import { SuccessResponse } from "../../common/utils/index.js";
// import { verifyOTP } from "./otp.service.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middlware/validation.middleware.js";
const router = Router();
router.post("/signup",validation(validators.signup) ,async (req, res, next) => {
  const result = await signup(req.body);

  return SuccessResponse({
    res,
    status: 201,
    message: "Done signup",
    data: { result },
  });
});
// login
router.post("/login", validation(validators.login), async (req, res, next) => {
  const result = await login(req.body,`${req.protocol}://${req.host}`)

  return SuccessResponse({
    res,
   
    message: "Done login",
    data: { result },
  });
});


//Otp verification route

router.patch("/verify-email",validation(validators.confirmEmail), async (req, res, next) => {
  const account = await confirmEmail(req.body);

  return SuccessResponse({
    res
  });
});

// resend confirm email otp
router.patch("/resend-verify-email",validation(validators.resendConfirmEmail), async (req, res, next) => {
 await resendConfirmEmail(req.body);

  return SuccessResponse({
    res
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
