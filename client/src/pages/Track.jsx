import {t} from '../i18n.jsx';
import {useEffect,useState} from 'react';import {useParams} from 'react-router-dom';import {api} from '../api.js';import {Badge} from './Card.jsx';
export default function Track(){const{id}=useParams();const[c,setC]=useState(null);const[h,setH]=useState([]);const[err,setErr]=useState('');const[ro,setRo]=useState(false);const[rm,setRm]=useState('');const[rs,setRs]=useState('');
 const sendReport=async e=>{e.preventDefault();try{setRs((await api(`/complaints/${id}/report`,{method:'POST',body:{reason:rm}})).message);setRo(false)}catch(x){setRs(x.message)}};
 useEffect(()=>{api('/complaints/'+id).then(setC).catch(e=>setErr(e.message));api(`/complaints/${id}/history`).then(setH).catch(()=>{})},[id]);
 if(err)return <p role="alert" className="text-red-700">{err}</p>;if(!c)return <p>Loading…</p>;
 return <div className="grid gap-8 md:grid-cols-2"><div className="space-y-3"><p className="text-sm text-slate-500">{c.complaintId}</p><h1 className="text-3xl font-bold text-navy">{c.title}</h1><Badge s={c.status}/>
  <p>{c.description}</p>
  <div>{rs&&<p role="status" className="text-teal">{rs}</p>}{ro?<form onSubmit={sendReport} className="flex gap-2"><input className="inp" required minLength={5} maxLength={300} placeholder={t('Why is this inappropriate?')} value={rm} onChange={e=>setRm(e.target.value)}/><button className="btn-s">{t('Send')}</button></form>:<button className="text-sm text-slate-600 underline" onClick={()=>setRo(true)}>{t('Report this complaint')}</button>}</div><p className="text-sm text-slate-600">{c.category} · {c.address}, {c.locality}</p>
  {c.assignedDepartment&&<p>Assigned to: <b>{c.assignedDepartment}</b></p>}{c.remarks&&<p>Remarks: {c.remarks}</p>}
  <div className="flex flex-wrap gap-2">{[...c.images,...c.resolutionImages].map(u=><img key={u} src={u} alt="Complaint evidence" className="h-32 rounded-lg object-cover"/>)}</div></div>
  <ol className="space-y-4 border-l-2 border-teal pl-5">{h.map((x,i)=><li key={i}><b>{x.newStatus}</b><p className="text-sm text-slate-600">{new Date(x.timestamp).toLocaleString('en-IN')}{x.remarks&&' — '+x.remarks}</p></li>)}</ol></div>}
