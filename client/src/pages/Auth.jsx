import {t} from '../i18n.jsx';import {useState} from 'react';import {api} from '../api.js';import {useAuth} from '../main.jsx';
export default function Auth(){const{login}=useAuth();const[reg,setReg]=useState(false);const[err,setErr]=useState('');const[busy,setBusy]=useState(false);
 const submit=async e=>{e.preventDefault();setBusy(true);setErr('');try{login(await api(reg?'/auth/register':'/auth/login',{method:'POST',body:Object.fromEntries(new FormData(e.target))}))}catch(x){setErr(x.message)}setBusy(false)};
 return <form onSubmit={submit} className="mx-auto max-w-sm space-y-3 rounded-xl bg-white p-6 shadow-sm"><h1 className="text-2xl font-bold text-navy">{reg?t('Create your account'):t('Log in')}</h1>
  {reg&&<><label className="block">{t("Full name")}<input name="name" required className="inp"/></label><label className="block">{t("Mobile number (optional)")}<input name="phone" inputMode="numeric" className="inp"/></label></>}
  <label className="block">{t("Email")}<input name="email" type="email" required className="inp"/></label><label className="block">{t("Password")}<input name="password" type="password" minLength={8} required className="inp"/></label>
  {err&&<p role="alert" className="text-red-700">{err}</p>}<button className="btn-p w-full" disabled={busy}>{reg?t('Create account'):t('Log in')}</button>
  <a href="/forgot" className="block text-teal underline">{t("Forgot password?")}</a><button type="button" className="text-teal underline" onClick={()=>setReg(!reg)}>{reg?t('I already have an account'):t('New here? Create an account')}</button></form>}
