import { create, find, findOne, findOneAndDelete } from "../../DB/database.repository.js";
import { messageModel, userModel } from "../../DB/index.js";
import { NotFoundException } from "../../common/utils/index.js";

// send message
export const sendMessage = async (recieverId,{content=undefined}={},files,user) => {
   const account=await findOne({
    model:userModel,
    filter:{
        _id:recieverId
    }
   })
   if(!account){
    throw NotFoundException({message:"reciever account not found"})
   }
   const message= await create({
    model:messageModel,
    data:{
        content,
         attachments:files.map((file)=>file.finalPath),
          recieverId,
          senderId:user?user._id:undefined

    }
   })
  return message;
};

// get message by id

export const getMessage = async (messageId,user) => {
   const message=await findOne({
    model:messageModel,
    filter:{
        _id:messageId,
        $or:[
           {recieverId:user._id},
           {senderId:user._id}
        ]
    },select:"-senderId"

   })
   if(!message){
    throw NotFoundException({message:"message not found"})
   }
  
  return message;
};

//get all messages

export const getAllMessage = async (user) => {
   const messages=await find({
    model:messageModel,
    filter:{
        $or:[
           {recieverId:user._id},
           {senderId:user._id}
        ]
    },select:"-senderId"

   })
   if(!messages){
    throw NotFoundException({message:"no messages found"})
   }
  
  return messages;
};


// delete message by id
export const deleteMessage = async (messageId,user) => {
   const message=await findOneAndDelete({
    model:messageModel,
    filter:{
        _id:messageId,
           recieverId:user._id
       
    },select:"-senderId"

   })
   if(!message){
    throw NotFoundException({message:"no message found"})
   }
  
  return message;
};