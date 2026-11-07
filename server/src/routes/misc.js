import { Router } from 'express';import { Complaint,ComplaintHistory,Report,User,Notification } from '../models/index.js';import { auth,role } from '../middleware/auth.js';
export const dashboard=Router(),notifications=Router(),admin=Router();
const group=f=>Complaint.aggregate([{$group:{_id:f,count:{$sum:1}}},{$sort:{count:-1}}]);
dashboard.get('/stats',async(req,res)=>{const[total,resolved,rejected,activeCitizens]=await Promise.all([Complaint.countDocuments(),Complaint.countDocuments({status:'Resolved'}),Complaint.countDocuments({status:'Rejected'}),User.countDocuments({role:'citizen'})]);
 res.json({total,resolved,pending:total-resolved-rejected,activeCitizens})});
dashboard.get('/analytics',async(req,res)=>{const[byCategory,byStatus,byLocality,monthly,resolution]=await Promise.all([group('$category'),group('$status'),group('$locality'),
 Complaint.aggregate([{$group:{_id:{$dateToString:{format:'%Y-%m',date:'$createdAt'}},count:{$sum:1}}},{$sort:{_id:1}}]),
 Complaint.aggregate([{$match:{status:'Resolved'}},{$group:{_id:'$category',avgDays:{$avg:{$divide:[{$subtract:['$updatedAt','$createdAt']},864e5]}}}}])]);
 res.json({byCategory,byStatus,byLocality,monthly,resolution})});
notifications.get('/',auth(),async(req,res)=>{const items=await Notification.find({userId:req.user._id}).sort('-createdAt').limit(50);res.json({items,unread:items.filter(n=>!n.isRead).length})});
notifications.patch('/:id/read',auth(),async(req,res)=>{await Notification.updateOne({_id:req.params.id,userId:req.user._id},{isRead:true});res.json({ok:true})});
admin.use(auth(),role('admin','staff'));
admin.get('/complaints',async(req,res)=>res.json(await Complaint.find().sort('-createdAt').limit(500).populate('createdBy','name')));
admin.patch('/complaints/:id/assign',async(req,res)=>{const c=await Complaint.findOneAndUpdate({complaintId:req.params.id},{assignedDepartment:req.body.department,status:'Assigned'},{new:true});
 if(!c)return res.status(404).json({message:'Complaint not found'});await Notification.create({userId:c.createdBy,title:'Complaint assigned',message:`${c.complaintId} was assigned to ${c.assignedDepartment}.`});res.json(c)});
admin.get('/export.csv',async(req,res)=>{const q=v=>{v=String(v??'');if(/^[=+\-@\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
 const rows=await Complaint.find().sort('-createdAt').limit(5000);
 res.type('text/csv').attachment('nagarsetu-complaints.csv').send(['ID,Title,Category,Locality,Status,Priority,Votes,Department,Created'].concat(rows.map(c=>[c.complaintId,c.title,c.category,c.locality,c.status,c.priority,c.votes,c.assignedDepartment,c.createdAt.toISOString()].map(q).join(','))).join('\n'))});
admin.get('/reports',async(req,res)=>res.json(await Report.find({status:'Open'}).sort('-createdAt').limit(100).populate('complaint','complaintId title status').populate('reportedBy','name')));
admin.patch('/reports/:id',async(req,res)=>{const r=await Report.findById(req.params.id).populate('complaint');if(!r)return res.status(404).json({message:'Report not found'});
 if(req.body.action==='reject'&&r.complaint){const c=r.complaint,prev=c.status;c.status='Rejected';c.remarks='Removed after a report was reviewed';await c.save();
  await ComplaintHistory.create({complaint:c._id,previousStatus:prev,newStatus:'Rejected',remarks:c.remarks,updatedBy:req.user._id});
  await Notification.create({userId:c.createdBy,title:'Complaint update',message:`${c.complaintId} was rejected after review.`});r.status='Actioned'}else r.status='Dismissed';
 await r.save();res.json({ok:true})});
admin.patch('/complaints/:id/priority',async(req,res)=>{if(!['Low','Medium','High'].includes(req.body.priority))return res.status(400).json({message:'Invalid priority'});
 const c=await Complaint.findOneAndUpdate({complaintId:req.params.id},{priority:req.body.priority});c?res.json({ok:true}):res.status(404).json({message:'Complaint not found'})});
admin.get('/users',role('admin'),async(req,res)=>res.json(await User.find().sort('-createdAt').limit(200)));
