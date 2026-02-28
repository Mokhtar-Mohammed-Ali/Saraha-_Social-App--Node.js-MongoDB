import { Router } from "express";
import { profile, rotateToken } from "./user.service.js";
import { SuccessResponse } from "../../common/utils/index.js";
import { authenticationMiddleware, authorizationMiddleware } from "../../middlware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enums/security.enums.js";
import { endPoints } from "./user.authorization.js";
const router = Router();

router.get("/",authenticationMiddleware(),authorizationMiddleware(endPoints.profile), async (req, res, next) => {
  const result = await profile(req.user);
  return SuccessResponse({
    res,
    data: result,
  });
});

// refresh token route
router.get("/refresh",authenticationMiddleware(TokenTypeEnum.REFRESH), async (req, res, next) => {
  const result = await rotateToken(req.user,`${req.protocol}://${req.host}`);
  return SuccessResponse({
    res,
    data: { result },
  });
});
export default router;
