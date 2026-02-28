import { TokenTypeEnum } from "../common/enums/security.enums.js";
import { BadRequestException, decodeToken, ForbiddenException } from "../common/utils/index.js";
import { login } from "../modules/auth/auth.service.js";

export const authenticationMiddleware = (tokenType = TokenTypeEnum.ACCESS) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        return next(
          new BadRequestException({ message: "missing authorization header" })
        );
      }

      const [schema, credentials] = authorization.split(" ");

      switch (schema) {
        case "Basic": {
          const [email, password] =
            Buffer.from(credentials, "base64")?.toString()?.split(":") || [];

          req.user = await login(
            { email, password },
            `${req.protocol}://${req.get("host")}`
          );

          return next();
        }

        case "Bearer": {
          req.user = await decodeToken({ token: credentials, tokenType });
          return next();
        }

        default:
          return next(
            new BadRequestException({ message: "missing authentication schema" })
          );
      }
    } catch (error) {
      return next(error);
    }
  };
};

// export const authenticationMiddleware =  (tokenType=TokenTypeEnum.ACCESS) => {
//     return async (req, res, next) => { 
//        const user =await decodeToken({token:req.headers.authorization, tokenType});
//        req.user = user;
//         next();
//      }
// }

// import { Buffer } from "node:buffer";
// import { TokenTypeEnum } from "../common/enums/security.enums.js";
// import { BadRequestException, decodeToken } from "../common/utils/index.js";

// export const authenticationMiddleware =
//   (tokenType = TokenTypeEnum.ACCESS) =>
//   async (req, res, next) => {

//     const { authorization } = req.headers;

//     if (!authorization) {
//       throw BadRequestException({ message: "Missing authorization header" });
//     }

//     const [authType, token] = authorization.split(" ");

//     switch (authType) {

//       case "Basic": {
//         const [email, password] = Buffer.from(token, "base64")
//           .toString()
//           .split(":");
// await login({ email, password },`${req.protocol}://${req.host}`);


//         break;
//       }

//       case "Bearer": {
//         const user = await decodeToken({
//           token,
//           tokenType,
//         });

//         req.user = user;
//         break;
//       }

//       default:
//         throw BadRequestException({
//           message: "Invalid authentication type❎",
//         });
//     }

//     next();
//   };

// authorization

export const authorizationMiddleware = (AccessRoles= []) => {
   return async (req, res, next) => { 
      if(!AccessRoles.includes(req.user.role)) {
         throw ForbiddenException({message:"you don't have access to this resource"});
      }
next();
    }

}