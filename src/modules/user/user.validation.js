import joi from "joi";
import {
  fileFieldValidation,
  generalValidationFields,
} from "../../common/utils/index.js";
export const sharedProfileValidation = {
  params: joi
    .object()
    .keys({
      userId: generalValidationFields.id.required(),
    })
    .required(),
};
// profile image validation "file": {
//     "fieldname": "attachment",
//     "originalname": "Media-Hub-New-Logo-2026.png",
//     "encoding": "7bit",
//     "mimetype": "image/png",
//     "finalPath": "uploads/profile/images/fa67ced9-dc22-45ce-8a44-2a9cb98cf08e-Media-Hub-New-Logo-2026.png",
//     "destination": "D:\\Assignments\\BackEnd\\ass11\\uploads\\profile\\images",
//     "filename": "fa67ced9-dc22-45ce-8a44-2a9cb98cf08e-Media-Hub-New-Logo-2026.png",
//     "path": "D:\\Assignments\\BackEnd\\ass11\\uploads\\profile\\images\\fa67ced9-dc22-45ce-8a44-2a9cb98cf08e-Media-Hub-New-Logo-2026.png",
//     "size": 382594
// }
export const profileImageValidation = {
  file: generalValidationFields.file(fileFieldValidation.image).required(),
};

// profile cover image validation
export const profileCoverImageValidation = {
  files: joi
    .array()
    .items(generalValidationFields.file(fileFieldValidation.image).required())
    .min(1)
    .max(5)
    .required(),
};

//profile attachments
export const profileAttachmentsValidation = {
  files: joi
    .object().keys({
profilImage:joi.array().items(generalValidationFields.file(fileFieldValidation.image).required()).min(1).max(5).required(),
profileCoverImage:joi.array().items(generalValidationFields.file(fileFieldValidation.image).required()).min(1).max(5).required(),
    })
    .required(),
};

