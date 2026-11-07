import { Router } from 'express';import crypto from 'crypto';import { Complaint,ComplaintHistory,Notification,Vote,Report,CATEGORIES,STATUSES } from '../models/index.js';
import { auth,role } from '../middleware/auth.js';import { upload,saveImages } from '../middleware/upload.js';
const r=Router();
const pub=c=>({id:c._id,complaintId:c.complaintId,title:c.title,description:c.description,category:c.category,images:c.images,resolutionImages:c.resolutionImages,
 locality:c.locality,address:c.address,location:c.location,status:c.status,priority:c.priority,votes:c.votes,assignedDepartment:c.assignedDepartment,remarks:c.remarks,createdAt:c.createdAt,updatedAt:c.updatedAt});
const notify=(userId,title,message)=>Notification.create({userId,title,message});
const esc=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const inDelhi=([lng,lat])=>lat>28.4&&lat<28.93&&lng>76.8&&lng<77.35;
const priorityOf=cat=>['Water Leakage','Electricity','Drainage & Sewage'].includes(cat)?'High':'Medium';
const find=(req,res)=>Complaint.findOne({complaintId:req.params.id}).then(c=>{if(!c)res.status(404).json({message:'Complaint not found'});return c});

r.post('/',auth(),upload.array('images',4),async(req,res)=>{
 const{title,description,category,address,locality,lat,lng,contactPhone}=req.body;
 if(!title||!description||!address||!locality||!CATEGORIES.includes(category))return res.status(400).json({message:'Fill in all required fields'});
 const co=[Number(lng),Number(lat)];if(co.some(Number.isNaN)||!inDelhi(co))return res.status(400).json({message:'Pick a location inside Delhi on the map'});
 if(!req.files?.length)return res.status(400).json({message:'Add at least one photo'});
 const similar=await Complaint.find({category,status:{$nin:['Resolved','Rejected']},location:{$near:{$geometry:{type:'Point',coordinates:co},$maxDistance:100}}}).limit(3);
 if(similar.length&&req.query.force!=='1')return res.status(409).json({message:'Similar open complaints exist within 100 m. Support one instead, or submit anyway.',similar:similar.map(pub)});
 const c=await Complaint.create({complaintId:'NS-'+new Date().getFullYear()+'-'+crypto.randomBytes(3).toString('hex').toUpperCase(),title,description,category,address,locality,
  location:{type:'Point',coordinates:co},images:await saveImages(req.files),createdBy:req.user._id,contactPhone,priority:priorityOf(category)});
 await ComplaintHistory.create({complaint:c._id,newStatus:'Submitted',updatedBy:req.user._id});
 await notify(req.user._id,'Complaint submitted',`Your complaint ${c.complaintId} has been submitted.`);
 res.status(201).json(pub(c))});

r.get('/',async(req,res)=>{const{q,category,status,locality,sort='new',mine,page=1,limit=12}=req.query;const f={};
 if(q)f.$or=[{title:new RegExp(esc(q),'i')},{locality:new RegExp(esc(q),'i')}];
 if(CATEGORIES.includes(category))f.category=category;if(STATUSES.includes(status))f.status=status;if(locality)f.locality=String(locality);
 if(mine){let ok=false;await auth()(req,res,()=>{ok=true});if(!ok)return;f.createdBy=req.user._id}
 const lim=Math.min(+limit||12,100),[items,total]=await Promise.all([Complaint.find(f).sort(sort==='votes'?{votes:-1}:{createdAt:-1}).skip((+page-1)*lim).limit(lim),Complaint.countDocuments(f)]);
 res.json({items:items.map(pub),total,pages:Math.ceil(total/lim)})});

r.get('/:id',async(req,res)=>{const c=await find(req,res);if(c)res.json(pub(c))});
r.get('/:id/history',async(req,res)=>{const c=await find(req,res);if(c)res.json(await ComplaintHistory.find({complaint:c._id}).sort('timestamp').select('previousStatus newStatus remarks timestamp -_id'))});

const own=async(req,res)=>{const c=await find(req,res);if(!c)return;
 if(String(c.createdBy)!==String(req.user._id))return void res.status(403).json({message:'Not your complaint'});
 if(c.status!=='Submitted')return void res.status(403).json({message:'Only complaints not yet under review can be changed'});return c};
r.put('/:id',auth(),async(req,res)=>{const c=await own(req,res);if(!c)return;for(const k of['title','description','address'])if(req.body[k])c[k]=req.body[k];await c.save();res.json(pub(c))});
r.delete('/:id',auth(),async(req,res)=>{const c=await own(req,res);if(!c)return;await Promise.all([c.deleteOne(),ComplaintHistory.deleteMany({complaint:c._id}),Vote.deleteMany({complaint:c._id})]);res.json({message:'Deleted'})});

r.patch('/:id/status',auth(),role('admin','staff'),upload.array('resolutionImages',4),async(req,res)=>{
 const{status,remarks}=req.body;if(!STATUSES.includes(status))return res.status(400).json({message:'Invalid status'});
 const c=await find(req,res);if(!c)return;const prev=c.status;c.status=status;if(remarks)c.remarks=remarks;
 if(req.files?.length)c.resolutionImages.push(...await saveImages(req.files));await c.save();
 await ComplaintHistory.create({complaint:c._id,previousStatus:prev,newStatus:status,remarks,updatedBy:req.user._id});
 await notify(c.createdBy,'Complaint update',`${c.complaintId} is now "${status}".`);res.json(pub(c))});

r.post('/:id/vote',auth(),async(req,res)=>{const c=await find(req,res);if(!c)return;
 try{await Vote.create({complaint:c._id,userId:req.user._id})}catch{return res.status(409).json({message:'You already supported this complaint'})}
 c.votes=await Vote.countDocuments({complaint:c._id});await c.save();res.json({votes:c.votes})});
r.delete('/:id/vote',auth(),async(req,res)=>{const c=await find(req,res);if(!c)return;
 await Vote.deleteOne({complaint:c._id,userId:req.user._id});c.votes=await Vote.countDocuments({complaint:c._id});await c.save();res.json({votes:c.votes})});
r.post('/:id/report',auth(),async(req,res)=>{const c=await find(req,res);if(!c)return;const reason=String(req.body.reason||'').trim();
 if(reason.length<5)return res.status(400).json({message:'Please explain the problem in a few words'});
 try{await Report.create({complaint:c._id,reportedBy:req.user._id,reason:reason.slice(0,300)})}catch{return res.status(409).json({message:'You already reported this complaint'})}
 res.status(201).json({message:'Report received. Our team will review it.'})});
export default r;
