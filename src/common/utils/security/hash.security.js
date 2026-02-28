import { compare, genSalt, hash } from "bcrypt";
import { SALT_ROUND } from "../../../../config/config.service.js";

export const generateHash= async({plainText,salt=SALT_ROUND,minor="b"}={})=>{
const generatedSalt = await genSalt(salt,minor)
return await hash(plainText,generatedSalt)
}

export const compareHash= async({plainText,hashedPassword}={})=>{
return await compare(plainText,hashedPassword)
}