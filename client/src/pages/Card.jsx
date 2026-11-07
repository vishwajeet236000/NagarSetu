import {t} from '../i18n.jsx';import {Link} from 'react-router-dom';
const tone={Resolved:'bg-emerald-100 text-emerald-800',Rejected:'bg-red-100 text-red-800','In Progress':'bg-amber-100 text-amber-800'};
export const Badge=({s})=><span className={'rounded-full px-2.5 py-0.5 text-sm '+(tone[s]||'bg-blue-100 text-blue-800')}>{t(s)}</span>;
export default function Card({c,onVote}){return <article className="overflow-hidden rounded-xl bg-white shadow-sm">
 {c.images?.[0]&&<img src={c.images[0]} alt={c.title} loading="lazy" className="h-40 w-full object-cover"/>}
 <div className="space-y-2 p-4"><Badge s={c.status}/><h3 className="font-bold text-navy"><Link to={'/complaint/'+c.complaintId}>{c.title}</Link></h3>
  <p className="text-sm text-slate-600">{c.category} · {c.locality} · {new Date(c.createdAt).toLocaleDateString('en-IN')}</p>
  <div className="flex items-center justify-between"><span className="text-sm">{c.votes} supporters</span>{onVote&&<button className="btn-s !py-1.5" onClick={()=>onVote(c)}>{t("Support")}</button>}</div></div></article>}
