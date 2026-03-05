import multer from "multer";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import {resolve} from "node:path";
import { FileValidation } from "./validation.multer.js";
export const localFileUploads = ({customPath="general",validation=[]})=>{
    const storage = multer.diskStorage({
        destination:function(req,file,cb){
            const fullPath=resolve(`../uploads/${customPath}`)
            
            if(!existsSync(fullPath)){
                mkdirSync(resolve(fullPath),{recursive:true});
                cb(null,resolve(fullPath));
            }
              cb(null, fullPath); 
        },
        filename:function(req,file,cb){
            const uniqueFileName = `${randomUUID()}-${file.originalname}`;
            file.finalPath=`uploads/${customPath}/${uniqueFileName}`;
            cb(null,uniqueFileName);
        }
 } )
    return multer({storage,fileFilter:FileValidation(validation),limits:{fileSize:5*1024*1024}});
};