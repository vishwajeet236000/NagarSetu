import 'dotenv/config';import mongoose from 'mongoose';import bcrypt from 'bcryptjs';import { User } from './models/index.js';
await mongoose.connect(process.env.MONGO_URI);
await User.updateOne({email:process.env.ADMIN_EMAIL},{$setOnInsert:{name:'NagarSetu Admin',email:process.env.ADMIN_EMAIL,role:'admin',password:await bcrypt.hash(process.env.ADMIN_PASSWORD,12)}},{upsert:true});
console.log('Admin ready:',process.env.ADMIN_EMAIL);process.exit(0);
