import nodemailer from 'nodemailer';
let tx;
export async function sendMail(to,subject,text){
 if(!process.env.SMTP_HOST){if(process.env.NODE_ENV!=='production')console.log(`[email not configured] ${to}: ${subject} - ${text}`);return}
 try{tx??=nodemailer.createTransport({host:process.env.SMTP_HOST,port:+process.env.SMTP_PORT||587,auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}:undefined});
  await tx.sendMail({from:process.env.MAIL_FROM,to,subject,text})}catch(e){console.error('Email failed:',e.message)}}
