// import {
//   TOKEN_SECRET_ADMIN_ACCESS,
//   TOKEN_SECRET_ADMIN_REFRESH,
//   TOKEN_SECRET_USER_ACCESS,
//   TOKEN_SECRET_USER_REFRESH,
// } from "../../../config/config.service.js";
import { TokenTypeEnum } from "../../common/enums/security.enums.js";
import { decodeToken, loginCredentials } from "../../common/utils/security/token.security.js";
import { findById } from "../../DB/database.repository.js";
import { userModel } from "../../DB/index.js";
import jwt from "jsonwebtoken";
// import {users} from '../../DB/model/index.js'
export const profile = async (user) => {
  // const user = await decodeToken({token: authorization});
  // console.log({ decoded });
  // let signature = undefined;

  // switch (decoded.aud) {
  //   case "system":
  //     signature = TOKEN_SECRET_ADMIN_ACCESS;

  //     break;

  //   default:
  //     signature = TOKEN_SECRET_USER_ACCESS;

  //     break;
  // }
  // const verifyToken = jwt.verify(authorization, signature);
  // const user = await findById({ _id: verifyToken.sub, model: userModel });

  return user;
};

// refresh token
export const rotateToken = async (user, issuer) => {
  // const decoded = jwt.decode(authorization);
  // const account = await decodeToken({token:authorization, tokenType: TokenTypeEnum.REFRESH });
  // console.log({ decoded });
  // let signature = undefined;

          // switch (decoded.aud) {
          //   case "refresh-system":
          //     signature = TOKEN_SECRET_ADMIN_REFRESH;

          //     break;

          //   default:
          //     signature = TOKEN_SECRET_USER_REFRESH;

          //     break;
          // }
   return await loginCredentials(user, issuer);

//   const verifyToken = jwt.verify(authorization, signature);
//   const accessToken = jwt.sign({ sub: decoded.sub }, TOKEN_SECRET_USER_ACCESS, {
//     // notBefore: "1s", // not before 1 second
//     expiresIn: "1h", // expire in 1 hour
//     audience: decoded.aud, // who will use this token
//     issuer: decoded.iss, // who create this token
//     algorithm: "HS256", // algorithm to encrypt the token
//     // jwtid: user._id.toString() + Math.floor(Math.random() * 100), // unique id for the token
//   });
//   return accessToken;
};
