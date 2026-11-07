import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import {api,CATEGORIES} from '../api.js';import {useT} from '../i18n.jsx';import Card from './Card.jsx';
export default function Home(){const{t}=useT();const[s,setS]=useState(null);const[recent,setRecent]=useState(null);const[err,setErr]=useState('');
 useEffect(()=>{api('/dashboard/stats').then(setS).catch(e=>setErr(e.message));api('/complaints?limit=3').then(d=>setRecent(d.items)).catch(()=>setRecent([]))},[]);
 return <div className="space-y-14">
  <section className="rounded-2xl bg-navy p-8 text-white md:p-14"><h1 className="max-w-2xl text-4xl font-bold leading-tight">{t("Let’s make Delhi cleaner, safer and better together.")}</h1>
   <p className="mt-4 max-w-xl text-white/80">{t("Report local problems, track their progress and help build a better Delhi through community participation.")}</p>
   <div className="mt-6 flex flex-wrap gap-3"><Link to="/report" className="btn-p">{t("Report an issue")}</Link><Link to="/explore" className="btn bg-white text-navy">{t("Explore reported issues")}</Link></div></section>
  <section aria-label="Live statistics" className="grid grid-cols-2 gap-4 md:grid-cols-4">
   {err?<p className="col-span-full text-red-700">Statistics unavailable: {err}</p>:[['Total complaints','total'],['Resolved','resolved'],['Pending','pending'],['Active citizens','activeCitizens']].map(([l,k])=>
    <div key={k} className="rounded-xl bg-white p-5 shadow-sm"><p className="text-3xl font-bold text-navy">{s?s[k]:'…'}</p><p className="text-slate-600">{t(l)}</p></div>)}</section>
  <section><h2 className="mb-4 text-2xl font-bold text-navy">{t("What can you report?")}</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">
   {CATEGORIES.map(c=><Link key={c} to={'/explore?category='+encodeURIComponent(c)} className="rounded-xl border border-slate-200 bg-white p-4 font-medium hover:border-teal">{c}</Link>)}</div></section>
  <section><h2 className="mb-4 text-2xl font-bold text-navy">{t("Recently reported")}</h2>
   {recent&&!recent.length?<p className="text-slate-600">No complaints yet. <Link className="text-teal underline" to="/report">Be the first to report one.</Link></p>:
   <div className="grid gap-4 md:grid-cols-3">{(recent||[]).map(c=><Card key={c.id} c={c}/>)}</div>}</section></div>}
