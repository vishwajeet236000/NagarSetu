import { Router } from 'express';import bcrypt from 'bcryptjs';import { body,validationResult } from 'express-validator';
import crypto from 'crypto';import { sendMail } from '../services/mail.js';import { User } from '../models/index.js';import { sign,auth } from '../middleware/auth.js';
const r=Router();
r.post('/register',body('name').trim().isLength({min:2}).withMessage('Enter your name'),body('email').isEmail().withMessage('Enter a valid email'),
 body('password').isLength({min:8}).withMessage('Password needs 8+ characters'),body('phone').optional({checkFalsy:true}).matches(/^[6-9]\d{9}$/).withMessage('Enter a 10-digit mobile number'),
 async(req,res)=>{const e=validationResult(req);if(!e.isEmpty())return res.status(400).json({message:e.array()[0].msg});
  const{name,email,password,phone}=req.body;
  if(await User.exists({email:email.toLowerCase()}))return res.status(409).json({message:'Email already registered'});
  const u=await User.create({name,email,phone,password:await bcrypt.hash(password,12)});
  res.status(201).json({token:sign(u),user:{id:u._id,name:u.name,role:u.role}})});
r.post('/login',async(req,res)=>{const u=await User.findOne({email:String(req.body.email||'').toLowerCase()}).select('+password');
 if(!u||!await bcrypt.compare(String(req.body.password||''),u.password))return res.status(401).json({message:'Incorrect email or password'});
 res.json({token:sign(u),user:{id:u._id,name:u.name,role:u.role}})});
const hash=t=>crypto.createHash('sha256').update(t).digest('hex');
r.post('/forgot',async(req,res)=>{const u=await User.findOne({email:String(req.body.email||'').toLowerCase()});
 if(u){const t=crypto.randomBytes(32).toString('hex');u.resetHash=hash(t);u.resetExpires=Date.now()+36e5;await u.save();
  await sendMail(u.email,'Reset your NagarSetu password',`Reset link (valid 1 hour): ${process.env.CLIENT_URL}/reset/${t}`)}
 res.json({message:'If that email is registered, a reset link has been sent.'})});
r.post('/reset',async(req,res)=>{const{token,password}=req.body;if(!token||String(password||'').length<8)return res.status(400).json({message:'Password needs 8+ characters'});
 const u=await User.findOne({resetHash:hash(String(token)),resetExpires:{$gt:Date.now()}}).select('+resetHash +resetExpires +password');
 if(!u)return res.status(400).json({message:'This reset link is invalid or has expired'});
 u.password=await bcrypt.hash(password,12);u.resetHash=u.resetExpires=undefined;await u.save();res.json({message:'Password updated. You can log in now.'})});
r.post('/logout',(req,res)=>res.json({message:'Logged out'}));
r.get('/me',auth(),(req,res)=>res.json({id:req.user._id,name:req.user.name,email:req.user.email,phone:req.user.phone,role:req.user.role}));
export default r;
