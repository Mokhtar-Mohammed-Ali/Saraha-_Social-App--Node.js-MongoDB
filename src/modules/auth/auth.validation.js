import joi from 'joi';
import { generalValidationFields } from '../../common/utils/index.js';

export const login = {
  body: joi.object().keys({
    email: generalValidationFields.email.required(),
    password: generalValidationFields.password.required(),
  }).required()
};

export const signup = {
  body: login.body.append().keys({
    userName: generalValidationFields.username.required(),
    phone: generalValidationFields.phone.required(),
    confirmPassword: generalValidationFields
      .confirmPassword("password")
      .required(),
  }).required(),
};

export const confirmEmail = {
  body: joi.object().keys({
    email: generalValidationFields.email.required(),
    otp: generalValidationFields.otp.required(),
   
  }).required(),
};
export const resendConfirmEmail = {
  body: joi.object().keys({
    email: generalValidationFields.email.required(),
   
  }).required(),
};

export const resetPasswordCode = {
 body:confirmEmail.body.append().keys({
  password:generalValidationFields.password.required(),
  confirmPassword:generalValidationFields.confirmPassword("password").required()
 }).required()
};