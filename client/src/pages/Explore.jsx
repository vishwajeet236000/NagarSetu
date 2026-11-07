import {t} from '../i18n.jsx';import {useEffect,useState} from 'react';import {useSearchParams,useNavigate} from 'react-router-dom';import {api,CATEGORIES,STATUSES} from '../api.js';import Card from './Card.jsx';import {useAuth} from '../main.jsx';
export default function Explore(){const[sp,setSp]=useSearchParams();const[d,setD]=useState(null);const[msg,setMsg]=useState('');const{user}=useAuth();const nav=useNavigate();
 const set=(k,v)=>{const n=new URLSearchParams(sp);v?n.set(k,v):n.delete(k);setSp(n)};
 useEffect(()=>{setD(null);api('/complaints?'+sp).then(setD).catch(e=>setMsg(e.message))},[sp]);
 const vote=async c=>{if(!user)return nav('/login');try{const r=await api(`/complaints/${c.complaintId}/vote`,{method:'POST'});setD(x=>({...x,items:x.items.map(i=>i.id===c.id?{...i,votes:r.votes}:i)}))}catch(e){setMsg(e.message)}};
 const sel=(k,opts,ph)=><select aria-label={t(ph)} className="inp" value={sp.get(k)||''} onChange={e=>set(k,e.target.value)}><option value="">{t(ph)}</option>{opts.map(o=><option key={o}>{o}</option>)}</select>;
 return <div><h1 className="mb-4 text-3xl font-bold text-navy">{t("Explore issues")}</h1>
  <div className="mb-6 grid gap-3 md:grid-cols-4"><input className="inp" aria-label="Search" placeholder={t("Search by title or locality")} defaultValue={sp.get('q')||''} onKeyDown={e=>e.key==='Enter'&&set('q',e.target.value)}/>
   {sel('category',CATEGORIES,'All categories')}{sel('status',STATUSES,'All statuses')}
   <select aria-label="Sort" className="inp" value={sp.get('sort')||'new'} onChange={e=>set('sort',e.target.value)}><option value="new">{t("Newest")}</option><option value="votes">{t("Most supported")}</option></select></div>
  {msg&&<p role="alert" className="mb-4 text-red-700">{msg}</p>}
  {d&&!d.items.length&&<p className="text-slate-600">No complaints match these filters.</p>}
  <div className="grid gap-4 md:grid-cols-3">{!d?[1,2,3].map(i=><div key={i} className="h-64 animate-pulse rounded-xl bg-slate-200"/>):d.items.map(c=><Card key={c.id} c={c} onVote={vote}/>)}</div></div>}
