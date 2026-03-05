import { Router } from "express";
import {
  profile,
  profileCoverImage,
  profileImage,
  rotateToken,
  sharedProfile,
} from "./user.service.js";
import {
  fileFieldValidation,
  localFileUploads,
  SuccessResponse,
} from "../../common/utils/index.js";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../../middlware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enums/security.enums.js";
import { endPoints } from "./user.authorization.js";
import { sharedProfileValidation } from "./user.validation.js";
import * as validators from "./user.validation.js";
import { validation } from "../../middlware/validation.middleware.js";
const router = Router();
// profile route
router.get(
  "/",
  authenticationMiddleware(),
  authorizationMiddleware(endPoints.profile),
  async (req, res, next) => {
    const result = await profile(req.user);
    return SuccessResponse({
      res,
      data: result,
    });
  },
);
//shared profile route
router.get(
  "/:userId/shared-profile",
  validation(validators.sharedProfileValidation),
  async (req, res, next) => {
    const result = await sharedProfile(req.params.userId);
    return SuccessResponse({
      res,
      data: result,
    });
  },
);

// profile image route
router.patch(
  "/profile-image",
  authenticationMiddleware(),
  localFileUploads({
    customPath: "profile/images",
    validation: fileFieldValidation.image,
  }).single("attachment"),
  validation(validators.profileImageValidation),
  async (req, res, next) => {
    console.log(req.file);
    const account = await profileImage(req.file, req.user);
    return SuccessResponse({
      res,
      data: { account },
    });
  },
);

//profile cover images route

router.patch(
  "/profile-cover-image",
  authenticationMiddleware(),
  localFileUploads({
    customPath: "profile/covers",
    validation: fileFieldValidation.image,
  }).array("attachments", 5),
    validation(validators.profileCoverImageValidation),

  async (req, res, next) => {
    console.log(req.files);
    const account = await profileCoverImage(req.files, req.user);
    return SuccessResponse({
      res,
      data: { account },
    });

    // fileds for multiple file uploads with different field names ex faces and covers
    //   .fields([
    //   { name: "faces", maxCount: 2 },
    //   { name: "covers", maxCount: 1 },
    //   ]),
    // async (req, res, next) => {
    //   console.log(req.files);
    //   // const account = await profileCoverImage(req.files, req.user);
    //   return SuccessResponse({
    //     res,
    //     data: { files:req.files },
    //   });


    // any file upload with any field name
    // .any()
    // async (req, res, next) => {
    //   console.log(req.files);
      // const account = await profileCoverImage(req.files, req.user);
    //   return SuccessResponse({
    //     res,
    //     data: { files:req.files },
    //   });

    // none file upload with any field name
    // .none()
    // async (req, res, next) => {
    //   console.log(req.body);
    //   return SuccessResponse({
    //     res,
    //     data: { body:req.body },
    //   });
  },
);

// refresh token route
router.get(
  "/refresh",
  authenticationMiddleware(TokenTypeEnum.REFRESH),
  async (req, res, next) => {
    const result = await rotateToken(req.user, `${req.protocol}://${req.host}`);
    return SuccessResponse({
      res,
      data: { result },
    });
  },
);
export default router;
