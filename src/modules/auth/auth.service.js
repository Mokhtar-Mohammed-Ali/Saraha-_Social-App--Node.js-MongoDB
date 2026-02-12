import {
  compareHash,
  ConflictException,
  generateHash,
  NotFoundException,
  encrypt,
} from "../../common/utils/index.js";
import { userModel, findOne, create } from "../../DB/index.js";
import { generateOTP } from "./otp.service.js";

export const signup = async (inputs) => {
  const { email } = inputs;

  const useExist = await findOne({
    model: userModel,
    filter: { email },
  });

  if (useExist)
    throw ConflictException({ message: "email already exist" });

  const user = await create({
    model: userModel,
    data: {
      ...inputs,
      password: await generateHash({ plainText: inputs.password }),
      phone: inputs.phone ? await encrypt(inputs.phone) : undefined,
    },
  });

  await generateOTP({ userId: user._id ,email: user.email });
    
  return user;
};


export const login = async (inputs) => {
  const { email, password } = inputs;
  const user = await findOne({
    model: userModel,
    filter: { email },
    options: { lean: true },
  });
  if (!user) throw NotFoundException({ message: "error in email or password" });
  const isMatch = await compareHash({
    plainText: password,
    hashedPassword: user.password,
  });
  if (!isMatch)
    throw NotFoundException({ message: "error in email or password" });
  return user;
};
