import { Router } from "express";
import { confirmEmail, confirmLoginOtp, login, requestForgotPasswordLink, requestForgotPasswordOtp, resendConfirmEmail, resetPasswordCode, resetPasswordWithLink, signup, signupWithGmail, toggle2FA, verifyForgotPasswordOtp, } from "./auth.service.js";
import { SuccessResponse } from "../../common/utils/index.js";
// import { verifyOTP } from "./otp.service.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middlware/validation.middleware.js";
import { authenticationMiddleware } from "../../middlware/authentication.middleware.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import geoip from "geoip-lite";
import { redisClient } from "../../DB/redis.connection.js";
import { deleteKey } from "../../common/services/redis.services.js";





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


//login rate limit operation
  const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: async function (req) {

        // ipapi
    //   const { country_code } = (await fromWhere(req.ip)) || {};
    //   console.log(country_code)

    //geoip
    const{country}=geoip.lookup(req.ip)||""
    console.log(geoip.lookup(req.ip))
      return country == "EG" ? 5 : 2;
    //   return country_code == "EG" ? 5 : 3;
    }, // Limit each IP to $ requests per `window` (here, per 15 minutes).
    // statusCode:429,
    // message:"to many request"
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    requestPropertyName: "ratelimit",
    // skipFailedRequests:true,  //skip faild traiel
     skipSuccessfulRequests:true,   // skip success traiel
    handler: (req, res, nex) => {
      return res
        .status(429)
        .json({ message: "to many request try again later" });
     },
    // دة بيتعارض مع المفتاح اللي بيعمله اللوجين فانا هعتمد علي originalUrl not path
    // keyGenerator: async (req, res, next) => {
      // console.log(req.headers["x-forwarded-for"])
    //   const ip = ipKeyGenerator(req.ip, 56);

    //   console.log(`${ip}-${req.path}`);
    //   return `${req.ip}-${req.path}`;
    // },

    // original key generator

    keyGenerator: (req) => {
    const ip = ipKeyGenerator(req.ip, 56);
    return `${ip}-${req.originalUrl}`; 
  },
     store: {
    async incr(key, cb) { // get called by keyGenerator
      try {
        const count = await redisClient.incr(key);
        if (count === 1) await redisClient.expire(key, 120); // 2 min TTL
        cb(null, count);
      } catch (err) {
        cb(err);
      }
    },
 
    async decrement(key) {  // called by kipFailedRequests:true ,  skipSuccessfulRequests:true,
      // del \\ decr
     await redisClient.del(key);

      
      
    },
  },
  });


// login
router.post("/login",loginLimiter,validation(validators.login), async (req, res, next) => {
  const credentials = await login(req.body,`${req.protocol}://${req.host}`)
await deleteKey(`${req.ip}-${req.originalUrl}`)
  return SuccessResponse({
    res,
   
    message: "Done login",
    data: { ...credentials },
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

// request forgot password otp
router.post("/forgot-password-otp",validation(validators.resendConfirmEmail), async (req, res, next) => {
 await requestForgotPasswordOtp(req.body);

  return SuccessResponse({
    res
  });
});
// verify password otp
router.patch("/verify-password-otp",validation(validators.confirmEmail), async (req, res, next) => {
 await verifyForgotPasswordOtp(req.body);

  return SuccessResponse({
    res
  });
});

// reset password
router.patch("/reset-password",validation(validators.resetPasswordCode), async (req, res, next) => {
 await resetPasswordCode(req.body);

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

// toggle 2 step
router.patch("/toggle-2fa", authenticationMiddleware(), async (req, res) => {
  const result = await toggle2FA(req.user);
  return SuccessResponse({ res, data: result });
});
//confirmation
router.post("/confirm-2fa", async (req, res) => {
  const result = await confirmLoginOtp(req.body, `${req.protocol}://${req.host}`);
  return SuccessResponse({ res, data: result });
});

// forgot password link
router.post("/forgot-password-link", async (req, res) => {
  await requestForgotPasswordLink(req.body);
  return SuccessResponse({ res, message: "Link Sent" });
});
//change password by link
router.patch("/reset-password-link", async (req, res) => {
  await resetPasswordWithLink(req.body);
  return SuccessResponse({ res, message: "Success" });
});
export default router;
