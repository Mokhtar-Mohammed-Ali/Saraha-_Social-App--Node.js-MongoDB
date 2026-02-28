
import {
  compareHash,
  ConflictException,
  generateHash,
  NotFoundException,
  encrypt,
} from "../../common/utils/index.js";
import { userModel, findOne, create } from "../../DB/index.js";
import { generateOTP } from "./otp.service.js";
import {
  TOKEN_SECRET_SYSTEM_ACCESS,
  TOKEN_SECRET_SYSTEM_REFRESH,
  TOKEN_SECRET_USER_ACCESS,
  TOKEN_SECRET_USER_REFRESH,
  WEB_CLIENT_ID,
} from "../../../config/config.service.js";
import { ProviderEnumms, RoleEnumms } from "../../common/enums/user.enums.js";
import { loginCredentials } from "../../common/utils/security/token.security.js";
 import {OAuth2Client} from'google-auth-library';
import { profile } from "../user/user.service.js";

export const signup = async (inputs) => {
  const { email } = inputs;

  const useExist = await findOne({
    model: userModel,
    filter: { email },
  });

  if (useExist) throw ConflictException({ message: "email already exist" });

  const user = await create({
    model: userModel,
    data: {
      ...inputs,
      password: await generateHash({ plainText: inputs.password }),
      phone: inputs.phone ? await encrypt(inputs.phone) : undefined,
    },
  });

  await generateOTP({ userId: user._id, email: user.email });

  return user;
};


// verify google account
const verifyGoogleAccount = async (idToken) => {

const client = new OAuth2Client(WEB_CLIENT_ID);

  const ticket = await client.verifyIdToken({
      idToken,
      audience: WEB_CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  return payload;
 
}


// sign up with google
export const signupWithGmail = async (idToken, issuer) => {
  console.log(idToken)
  const payload = await verifyGoogleAccount(idToken); //payloade
  console.log({payload});
  const checkUserExist=await findOne({model:userModel, filter:{email:payload.email}});
if(checkUserExist){
  if(checkUserExist.provider != ProviderEnumms.GOOGLE){
    throw ConflictException({message:"email already exist with another provider"})
  }
  return {status:200, credentials: await loginWithGmail(idToken, issuer)}; // login with google look ⬇⬇
}
const user=await create({
  model:userModel, 
  data:{
    firstName:payload.given_name,
    lastName:payload.family_name,
    email:payload.email,
    confirmEmail: new Date(),
  picProfile:payload.picture,
    provider:ProviderEnumms.GOOGLE,

  }
});
return {status:201, credentials: await loginCredentials(user,issuer)};
}



export const login = async (inputs, issuer) => {
  console.log({ issuer });
  const { email, password } = inputs;
  const user = await findOne({
    model: userModel,
    filter: { email, provider: ProviderEnumms.SYSTEM },
    options: { lean: true },
  });

  if (!user) throw NotFoundException({ message: "error in email or password" });
  const isMatch = await compareHash({
    plainText: password,
    hashedPassword: user.password,
  });
  if (!isMatch)
    throw NotFoundException({ message: "error in email or password" });
  console.log(user.role);
  console.log(user);
  let signature = undefined;
  let audience = "User";
  let refreshSignature = undefined;
  let refreshAudience = "User";
  switch (user.role) {
    case RoleEnumms.SYSTEM:
      signature = TOKEN_SECRET_SYSTEM_ACCESS;
      refreshSignature = TOKEN_SECRET_SYSTEM_REFRESH;
      audience = "system";
      refreshAudience = "refresh-system";
      break;

    default:
      signature = TOKEN_SECRET_USER_ACCESS;
      refreshSignature = TOKEN_SECRET_USER_REFRESH;

      audience = "User";
      refreshAudience = "User";

      break;
  }

  return await loginCredentials(user, issuer);
  //   const accessToken = jwt.sign({ sub: user._id }, signature, {
  //     // notBefore: "1s", // not before 1 second
  //     expiresIn: "1h", // expire in 1 hour
  //     audience: audience, // who will use this token
  //     issuer: issuer, // who create this token
  //     algorithm: "HS256", // algorithm to encrypt the token
  //     // jwtid: user._id.toString() + Math.floor(Math.random() * 100), // unique id for the token
  //   });
  //   const refreshToken = jwt.sign({ sub: user._id }, refreshSignature, {
  //     // notBefore: "1s", // not before 1 second
  //     expiresIn: "1y", // expire in 1 year
  //     audience: refreshAudience, // who will use this token
  //     issuer: issuer, // who create this token
  //     algorithm: "HS256", // algorithm to encrypt the token
  //     // jwtid: user._id.toString() + Math.floor(Math.random() * 100), // unique id for the token
  //   });
  //   return { accessToken, refreshToken };
};

// login with google
export const loginWithGmail = async (idToken, issuer) => {
  console.log(idToken)
  const payload = await verifyGoogleAccount(idToken); //payloade
  console.log({payload});
  const user=await findOne({model:userModel, filter:{email:payload.email},provider:ProviderEnumms.GOOGLE});
if(!user) {
    throw NotFoundException({message:"email not found, please sign up first"})
  }
 return await loginCredentials(user, issuer);
}

