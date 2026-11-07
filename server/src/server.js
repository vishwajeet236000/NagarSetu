import 'dotenv/config';import express from 'express';import mongoose from 'mongoose';import helmet from 'helmet';import cors from 'cors';import rateLimit from 'express-rate-limit';import sanitize from 'express-mongo-sanitize';
import auth from './routes/auth.js';import complaints from './routes/complaints.js';import { dashboard,notifications,admin } from './routes/misc.js';
for(const k of['MONGO_URI','JWT_SECRET'])if(!process.env[k]){console.error(`Missing ${k} in .env`);process.exit(1)}
const app=express();app.set('trust proxy',1);
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}),cors({origin:process.env.CLIENT_URL}),express.json({limit:'100kb'}),sanitize());
app.use('/api',rateLimit({windowMs:15*60e3,limit:300}));app.use('/api/auth',rateLimit({windowMs:15*60e3,limit:30}));
app.use('/uploads',express.static('uploads'));app.get('/api/health',(q,s)=>s.json({ok:true,db:mongoose.connection.readyState===1}));
app.use('/api/auth',auth);app.use('/api/complaints',complaints);app.use('/api/dashboard',dashboard);app.use('/api/notifications',notifications);app.use('/api/admin',admin);
app.use((e,q,s,n)=>{const m=e.message?.startsWith('Only');if(!m)console.error(e);s.status(m?400:500).json({message:m?e.message:'Something went wrong'})});
mongoose.connect(process.env.MONGO_URI).then(()=>app.listen(process.env.PORT||5000,()=>console.log('NagarSetu API running')));
