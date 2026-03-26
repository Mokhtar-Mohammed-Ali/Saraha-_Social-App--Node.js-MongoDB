import Joi from "joi";
import { fileFieldValidation, generalValidationFields } from "../../common/utils/index.js";

export const sendMesageValidation={
    params:Joi.object().keys({
        recieverId:generalValidationFields.id.required(),
    }).required(),
    body:Joi.object().keys({
        content:Joi.string().min(2).max(10000)
    }),
    fiels:Joi.array().items(generalValidationFields.file(fileFieldValidation.image)).min(0).max(2)
}

export const getMesageValidation={
    params:Joi.object().keys({
        messageId:generalValidationFields.id.required(),
    }).required(),
   
}