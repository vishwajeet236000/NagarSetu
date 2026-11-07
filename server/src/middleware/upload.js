import multer from 'multer';import fs from 'fs';import path from 'path';import crypto from 'crypto';import { v2 as cloudinary } from 'cloudinary';
export const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:4},
 fileFilter:(r,f,cb)=>/^image\/(jpeg|png|webp)$/.test(f.mimetype)?cb(null,true):cb(new Error('Only JPG, PNG or WebP images up to 5 MB'))});
const useCloud=()=>!!process.env.CLOUDINARY_CLOUD_NAME;
export async function saveImages(files=[]){
 if(useCloud())cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
 return Promise.all(files.map(async f=>{
  if(useCloud())return new Promise((ok,no)=>cloudinary.uploader.upload_stream({folder:'nagarsetu'},(e,r)=>e?no(e):ok(r.secure_url)).end(f.buffer));
  fs.mkdirSync('uploads',{recursive:true});const n=crypto.randomUUID()+path.extname(f.originalname).toLowerCase().replace(/[^.a-z]/g,'');
  fs.writeFileSync(path.join('uploads',n),f.buffer);return `/uploads/${n}`;}));}
