// import {
//   TOKEN_SECRET_ADMIN_ACCESS,
//   TOKEN_SECRET_ADMIN_REFRESH,
//   TOKEN_SECRET_USER_ACCESS,
//   TOKEN_SECRET_USER_REFRESH,
// } from "../../../config/config.service.js";
// import { TokenTypeEnum } from "../../common/enums/security.enums.js";
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} from "../../../config/config.service.js";
import { logoutEnumms } from "../../common/enums/user.enums.js";
import {
  allKeysByPrefix,
  deleteKey,
  revokeTokenKey,
  revokeTokenKeyPrefix,
  set,
} from "../../common/services/redis.services.js";
import {
  BadRequestException,
  ConflictException,
  encrypt,
  NotFoundException,
} from "../../common/utils/index.js";
import {
  decodeToken,
  loginCredentials,
} from "../../common/utils/security/token.security.js";
import {
  create,
  deleteMany,
  findById,
  findOne,
  updateOne,
} from "../../DB/database.repository.js";
import { tokenModel, userModel } from "../../DB/index.js";


// import jwt from "jsonwebtoken";
// import {users} from '../../DB/model/index.js'

// profile
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
// shared profile
export const sharedProfile = async (userId) => {
  const account = await findOne({
    model: userModel,
    filter: { _id: userId },
    select: "-passsword",
  });
  if (!account) {
    throw NotFoundException("user not found");
  }
  if (account.phone) {
    account.phone = await encrypt(account.phone);
  }
  return account;
};
// profile image
export const profileImage = async (file, user) => {
  if (user.profilePic) {
    if (!user.profileGallery) {
      user.profileGallery = [];
    }

    user.profileGallery.push(user.profilePic);
  }
  user.profilePic = file.finalPath;
  await user.save();
  return user;
};
//profile cover images

// export const profileCoverImage=async(files,user)=>{

//    const newImages = files.map(file => file.finalPath);
//    const totalImages = [...user.profilePicCover, ...newImages];

//     if (totalImages.length > 5) {
//    throw BadRequestException({
//       message: "Maximum 5 cover images allowed",
//     });
//   }
// user.profilePicCover=totalImages;
// //  user.profilePicCover = totalImages.slice(-5); keep oly 5
// await user.save();
// return user
// }

// profile cover images by mongoose methods

export const profileCoverImage = async (files, user) => {
  const newImages = files.map((file) => file.finalPath);

  const result = await updateOne({
    model: userModel,
    filter: {
      _id: user._id,
      $expr: {
        $lte: [
          { $size: { $ifNull: ["$profilePicCover", []] } },
          5 - newImages.length,
        ],
      },
    },
    update: {
      $push: {
        profilePicCover: {
          $each: newImages,
        },
      },
    },
  });

  if (!result.modifiedCount) {
    throw BadRequestException({
      message: "Maximum 5 cover images allowed",
    });
  }

  return await findById({
    model: userModel,
    id: user._id,
  });
};

// refresh token
export const rotateToken = async (user, { jti, iat, sub }, issuer) => {
  if (iat + ACCESS_TOKEN_EXPIRATION * 1000 >= Date.now() + 30000) {
    throw ConflictException({ message: "token is not expired yet" });
  }

  //befor redis
  // await create({
  //   model: tokenModel,
  //   data: {
  //     userId: user._id,
  //     jti,
  //     expiresIn: new Date(Date.now(iat + REFRESH_TOKEN_EXPIRATION) * 1000),
  //   },
  // });

//after redis
await set({
       key: revokeTokenKey({ userId: sub, jti }),
       value: jti,
        ttl:iat + REFRESH_TOKEN_EXPIRATION,
      });

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
//logout
export const logout = async ({ flag }, user, { jti, iat, sub }) => {
  let status = 200;
  switch (flag) {
    case logoutEnumms.ALL:
      user.changeCredentialsTime = new Date();
      //befor redis
      // await deleteMany({ model: tokenModel, filter: { userId: user._id } });

      // after redis
      await user.save();
const keys = await allKeysByPrefix(`${revokeTokenKeyPrefix(sub)}`);
await deleteKey(keys);
      break;
    case logoutEnumms.ONLY:
      //without redis
      // await create({
      //   model: tokenModel,
      //   data: {
      //     userId: user._id,
      //     jti,
      //     expiresIn: new Date(Date.now(iat + REFRESH_TOKEN_EXPIRATION) * 1000),
      //   },
      // });

      //with redis
      await set({
       key: revokeTokenKey({ userId: sub, jti }),
        value:jti,
        ttl:iat + REFRESH_TOKEN_EXPIRATION,
      });
      status = 201;
      break;
  }
  return status;
};
