// import {
//   TOKEN_SECRET_ADMIN_ACCESS,
//   TOKEN_SECRET_ADMIN_REFRESH,
//   TOKEN_SECRET_USER_ACCESS,
//   TOKEN_SECRET_USER_REFRESH,
// } from "../../../config/config.service.js";
// import { TokenTypeEnum } from "../../common/enums/security.enums.js";
import { BadRequestException, encrypt, NotFoundException } from "../../common/utils/index.js";
import { decodeToken, loginCredentials } from "../../common/utils/security/token.security.js";
import { findById, findOne, updateOne } from "../../DB/database.repository.js";
import { userModel } from "../../DB/index.js";
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
export const sharedProfile =async(userId)=>{
  const account = await findOne({model:userModel,filter:{_id:userId},select:"-passsword"});
  if(!account){
    throw NotFoundException("user not found");
  }
  if(account.phone){
    account.phone = await encrypt(account.phone);
  }
  return account;
}
// profile image
export const profileImage=async(file,user)=>{

   if (user.profilePic) {

    if (!user.profileGallery) {
      user.profileGallery = [];
    }

    user.profileGallery.push(user.profilePic);
  }
user.profilePic=file.finalPath;
await user.save();
return user
}
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

  const newImages = files.map(file => file.finalPath);

  const result = await updateOne({
    model: userModel,
    filter: {
      _id: user._id,
      $expr: {
        $lte: [
          { $size: { $ifNull: ["$profilePicCover", []] } },
          5 - newImages.length
        ]
      }
    },
    update: {
      $push: {
        profilePicCover: {
          $each: newImages
        }
      }
    }
  });

  if (!result.modifiedCount) {
    throw  BadRequestException({
      message: "Maximum 5 cover images allowed",
    });
  }

  return await findById({
    model: userModel,
    id: user._id
  });
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
