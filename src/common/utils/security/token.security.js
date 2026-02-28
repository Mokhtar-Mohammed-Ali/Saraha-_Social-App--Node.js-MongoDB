import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  TOKEN_SECRET_SYSTEM_ACCESS,
  TOKEN_SECRET_SYSTEM_REFRESH,
  TOKEN_SECRET_USER_ACCESS,
  TOKEN_SECRET_USER_REFRESH,
} from "../../../../config/config.service.js";
import jwt from "jsonwebtoken";
import { findOne } from "../../../DB/database.repository.js";
import { userModel } from "../../../DB/models/user.model.js";
import {
  BadRequestException,
  NotFoundException,
} from "../response/error.response.js";
import { TokenTypeEnum } from "../../enums/security.enums.js";
import { RoleEnumms } from "../../enums/user.enums.js";
// generate token
export const generateToken = async ({
  payload = {},
  secret = TOKEN_SECRET_USER_ACCESS,
  options,
}) => {
  return jwt.sign(payload, secret, options);
};
// verify token
export const verifyToken = async (token, secret = TOKEN_SECRET_USER_ACCESS) => {
  return jwt.verify(token, secret);
};

//get token signature access or refresh
export const getTokenSignature = ({
  tokenType = TokenTypeEnum.ACCESS,
  level,
}) => {
  const { accessSignature, refreshSignature } = getTokenSignatureLevel(level);
  let signature = undefined;
  switch (tokenType) {
    case TokenTypeEnum.REFRESH:
      signature = refreshSignature;
      break;

    default:
      signature = accessSignature;
      break;
  }
  return signature;
};
// get token signature level System or User
export const getTokenSignatureLevel = (level) => {
  let signature = { accessSignature: undefined, refreshSignature: undefined };
  switch (level) {
    case RoleEnumms.Admin:
      signature = {
        accessSignature: TOKEN_SECRET_SYSTEM_ACCESS,
        refreshSignature: TOKEN_SECRET_SYSTEM_REFRESH,
      };
      break;

    default:
      signature = {
        accessSignature: TOKEN_SECRET_USER_ACCESS,
        refreshSignature: TOKEN_SECRET_USER_REFRESH,
      };
      break;
  }
  return signature;
};
// decode token
export const decodeToken = async ({
  token,
  tokenType = TokenTypeEnum.ACCESS,
}) => {
  const decoded = jwt.decode(token);
  console.log({ decoded });
  if (!decoded?.aud?.length)
    throw BadRequestException({ message: "invalid token" });
  const [tokeApproatch, level] = decoded.aud || [];
  console.log({ tokeApproatch, level });
  if (tokenType !== tokeApproatch)
    throw BadRequestException({
      message: `invalid token type ${tokenType}❎ you must be ${tokeApproatch} ✅`,
    });
  const secretSignature = getTokenSignature({
    tokenType: tokeApproatch,
    level,
  });
  const verifyedData = await verifyToken(token, secretSignature);
  console.log({ verifyedData });
  const user = await findOne({
    model: userModel,
    filter: { _id: verifyedData.sub },
  });
  if (!user) throw NotFoundException({ message: "user not found" });
  return user;
};
// login and generate access and refresh token
export const loginCredentials = async (user, issuer) => {
  const { accessSignature, refreshSignature } = getTokenSignatureLevel(
    user.role,
  );
  const accessToken = await generateToken({
    payload: { sub: user._id },
    secret: accessSignature,
    options: {
      expiresIn: ACCESS_TOKEN_EXPIRATION, // expire in 1 hour
      audience: [TokenTypeEnum.ACCESS, user.role], // who will use this token
      issuer: issuer, // who create this token
      algorithm: "HS256", // algorithm to encrypt the token
      // jwtid: user._id.toString() + Math.floor(Math.random() * 100), // unique id for the token
      // notBefore: "1s", // not before 1 second
    },
  });

  // jwt.sign({ sub: user._id }, TOKEN_SECRET_USER_ACCESS, {
  //  // notBefore: "1s", // not before 1 second
  //   expiresIn: 1800, // expire in 1 hour
  //   audience:["web","mobile"], // who will use this token
  //   issuer: issuer, // who create this token
  //   algorithm: "HS256", // algorithm to encrypt the token
  //  // jwtid: user._id.toString() + Math.floor(Math.random() * 100), // unique id for the token
  // });
  const refreshToken = await generateToken({
    payload: { sub: user._id },
    secret: refreshSignature,
    options: {
      expiresIn: REFRESH_TOKEN_EXPIRATION, // expire in 1 year
      audience: [TokenTypeEnum.REFRESH, user.role], // who will use this token
      issuer: issuer, // who create this token
      algorithm: "HS256", // algorithm to encrypt the token
      // jwtid: user._id.toString() + Math.floor(Math.random() * 100), // unique id for the token
    },
  });
  //  jwt.sign({ sub: user._id }, TOKEN_SECRET_USER_REFRESH, {
  //  // notBefore: "1s", // not before 1 second
  //   expiresIn: "1y", // expire in 1 year
  //   audience:["web","mobile"], // who will use this token
  //   issuer: issuer, // who create this token
  //   algorithm: "HS256", // algorithm to encrypt the token
  //  // jwtid: user._id.toString() + Math.floor(Math.random() * 100), // unique id for the token
  // });
  return { accessToken, refreshToken };
};
