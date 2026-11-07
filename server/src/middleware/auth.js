import jwt from 'jsonwebtoken';import { User } from '../models/index.js';
export const sign=u=>jwt.sign({id:u._id},process.env.JWT_SECRET,{expiresIn:'7d'});
export const auth=(required=true)=>async(req,res,next)=>{
 const t=(req.headers.authorization||'').replace('Bearer ','');
 if(!t){return required?res.status(401).json({message:'Please log in'}):next()}
 try{req.user=await User.findById(jwt.verify(t,process.env.JWT_SECRET).id);if(!req.user)throw 0;next()}
 catch{res.status(401).json({message:'Session expired, please log in again'})}};
export const role=(...r)=>(req,res,next)=>r.includes(req.user?.role)?next():res.status(403).json({message:'Not allowed'});
