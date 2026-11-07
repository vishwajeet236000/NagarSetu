import mongoose from 'mongoose';import { sendMail } from '../services/mail.js';
const { Schema, model } = mongoose;
export const CATEGORIES=['Garbage & Waste','Road Damage & Potholes','Water Leakage','Streetlight','Drainage & Sewage','Electricity','Public Sanitation','Other'];
export const STATUSES=['Submitted','Under Review','Assigned','In Progress','Resolved','Rejected'];
export const User=model('User',new Schema({
 name:{type:String,required:true,trim:true,maxlength:80},
 email:{type:String,required:true,unique:true,lowercase:true},
 password:{type:String,required:true,select:false},
 phone:{type:String},role:{type:String,enum:['citizen','admin','staff'],default:'citizen'},
 profileImage:String,resetHash:{type:String,select:false},resetExpires:{type:Date,select:false}},{timestamps:{createdAt:true,updatedAt:false}}));
const c=new Schema({
 complaintId:{type:String,unique:true},title:{type:String,required:true,maxlength:120},
 description:{type:String,required:true,maxlength:2000},category:{type:String,enum:CATEGORIES,required:true},
 images:[String],resolutionImages:[String],address:{type:String,required:true},locality:{type:String,required:true,index:true},
 location:{type:{type:String,enum:['Point'],default:'Point'},coordinates:{type:[Number],required:true}},
 status:{type:String,enum:STATUSES,default:'Submitted',index:true},priority:{type:String,enum:['Low','Medium','High'],default:'Medium'},
 createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true},
 contactPhone:String,assignedDepartment:String,assignedTo:{type:Schema.Types.ObjectId,ref:'User'},
 remarks:String,votes:{type:Number,default:0}},{timestamps:true});
c.index({location:'2dsphere'});
export const Complaint=model('Complaint',c);
export const ComplaintHistory=model('ComplaintHistory',new Schema({
 complaint:{type:Schema.Types.ObjectId,ref:'Complaint',index:true},previousStatus:String,newStatus:String,remarks:String,
 updatedBy:{type:Schema.Types.ObjectId,ref:'User'},timestamp:{type:Date,default:Date.now}}));
const nSchema=new Schema({
 userId:{type:Schema.Types.ObjectId,ref:'User',index:true},title:String,message:String,isRead:{type:Boolean,default:false}},{timestamps:{createdAt:true,updatedAt:false}});
nSchema.post('save',async function(){const u=await mongoose.model('User').findById(this.userId);if(u)sendMail(u.email,this.title,this.message)});
export const Notification=model('Notification',nSchema);
const v=new Schema({complaint:{type:Schema.Types.ObjectId,ref:'Complaint'},userId:{type:Schema.Types.ObjectId,ref:'User'}},{timestamps:{createdAt:true,updatedAt:false}});
v.index({complaint:1,userId:1},{unique:true});
export const Report=model('Report',(()=>{const s=new Schema({complaint:{type:Schema.Types.ObjectId,ref:'Complaint',index:true},reportedBy:{type:Schema.Types.ObjectId,ref:'User'},reason:{type:String,maxlength:300},status:{type:String,enum:['Open','Dismissed','Actioned'],default:'Open'}},{timestamps:true});s.index({complaint:1,reportedBy:1},{unique:true});return s})());
export const Vote=model('Vote',v);
