import { Router } from "express";
import { BadRequestException, decodeToken, fileFieldValidation, localFileUploads, SuccessResponse } from "../../common/utils/index.js";
import { deleteMessage, getAllMessage, getMessage, sendMessage } from "./message.service.js";
import * as validators from "./message.validation.js"
import { validation } from "../../middlware/validation.middleware.js";
import { TokenTypeEnum } from "../../common/enums/security.enums.js";
import { authenticationMiddleware } from "../../middlware/authentication.middleware.js";
const router =Router()


// get all messages

router.get("/all-messages",
    authenticationMiddleware(),
    async(req,res,next)=>{
  

const messages=await getAllMessage(req.user)

    return SuccessResponse({res,status:201,data:{messages}})
})

// send message
router.post("/:recieverId",
    async(req,res,next)=>{
if(req.headers.authorization){
const { user, decoded } = await decodeToken({ token: req.headers.authorization.split(" ")[1], tokenType:TokenTypeEnum.ACCESS });
         req.user = user;
         req.decoded = decoded;
}
next()
    },
    localFileUploads({validation:fileFieldValidation.image,customPath:"Messages",maxSize:1}).array("attachments",2),
    validation(validators.sendMesageValidation)
    ,async(req,res,next)=>{
        if(!req.body?.content && !req.files?.length){
    throw BadRequestException({message:"validation error",extra:{key:"body",path:["content"],message:"missing content"}})
}

const message=await sendMessage(req.params.recieverId,req.body,req.files,req.user)

    return SuccessResponse({res,status:201,data:{message}})
})

// get message by id

router.get("/:messageId",
    authenticationMiddleware(),
    validation(validators.getMesageValidation)
    ,async(req,res,next)=>{
  

const message=await getMessage(req.params.messageId,req.user)

    return SuccessResponse({res,status:201,data:{message}})
})


router.delete("/:messageId",
    authenticationMiddleware(),
    validation(validators.getMesageValidation)
    ,async(req,res,next)=>{
  

const message=await deleteMessage(req.params.messageId,req.user)

    return SuccessResponse({res,data:{message}})
})



export default router