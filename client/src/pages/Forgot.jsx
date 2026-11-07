import {t} from '../i18n.jsx';import {useState} from 'react';import {useParams,Link} from 'react-router-dom';import {api} from '../api.js';
export default function Forgot(){const{token}=useParams();const[msg,setMsg]=useState('');const[err,setErr]=useState('');
 const go=async e=>{e.preventDefault();setErr('');setMsg('');const b=Object.fromEntries(new FormData(e.target));try{setMsg((await api(token?'/auth/reset':'/auth/forgot',{method:'POST',body:{...b,token}})).message)}catch(x){setErr(x.message)}};
 return <form onSubmit={go} className="mx-auto max-w-sm space-y-3 rounded-xl bg-white p-6 shadow-sm"><h1 className="text-2xl font-bold text-navy">{token?t('Set a new password'):t('Reset your password')}</h1>
  {token?<label className="block">{t("New password")}<input name="password" type="password" minLength={8} required className="inp"/></label>:<label className="block">{t("Email")}<input name="email" type="email" required className="inp"/></label>}
  {msg&&<p role="status" className="text-emerald-700">{msg}</p>}{err&&<p role="alert" className="text-red-700">{err}</p>}
  <button className="btn-p w-full">{token?t('Save password'):t('Send reset link')}</button><Link to="/login" className="block text-teal underline">{t("Back to log in")}</Link></form>}
