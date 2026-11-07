import {useEffect,useState} from 'react';import {BarChart,Bar,PieChart,Pie,Cell,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts';import {api} from '../api.js';import {t} from '../i18n.jsx';
const PAL=['#0f8b8d','#0f2a4a','#d97706','#7c3aed','#16a34a','#dc2626'];
const Box=({title,children})=><section className="rounded-xl bg-white p-4 shadow-sm"><h2 className="mb-2 font-bold text-navy">{t(title)}</h2><div className="h-60">{children}</div></section>;
const Bars=({d,v='count'})=><ResponsiveContainer><BarChart data={d}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="_id" tick={{fontSize:11}}/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey={v} fill="#0f8b8d"/></BarChart></ResponsiveContainer>;
export default function Transparency(){const[s,setS]=useState(null);const[a,setA]=useState(null);const[err,setErr]=useState('');
 useEffect(()=>{api('/dashboard/stats').then(setS).catch(e=>setErr(e.message));api('/dashboard/analytics').then(setA).catch(()=>{})},[]);
 if(err)return <p role="alert" className="text-red-700">{err}</p>;
 return <div className="space-y-6"><h1 className="text-3xl font-bold text-navy">{t('Public transparency dashboard')}</h1>
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[['Total complaints',s?.total],['Resolved',s?.resolved],['Pending',s?.pending],['Resolution rate',s?(s.total?Math.round(s.resolved/s.total*100)+'%':'0%'):undefined]].map(([l,v])=><div key={l} className="rounded-xl bg-white p-5 shadow-sm"><p className="text-3xl font-bold text-navy">{v??'…'}</p><p>{t(l)}</p></div>)}</div>
  {s&&!s.total&&<p>{t('No data yet.')}</p>}
  {a&&s?.total>0&&<div className="grid gap-4 md:grid-cols-2"><Box title="Complaints by status"><ResponsiveContainer><PieChart><Pie data={a.byStatus} dataKey="count" nameKey="_id" label>{a.byStatus.map((_,i)=><Cell key={i} fill={PAL[i%6]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></Box>
   <Box title="Complaints by category"><Bars d={a.byCategory}/></Box><Box title="Complaints by locality"><Bars d={a.byLocality}/></Box>
   <Box title="Average days to resolve">{a.resolution.length?<Bars v="avgDays" d={a.resolution.map(r=>({...r,avgDays:+r.avgDays.toFixed(1)}))}/>:<p>{t('No data yet.')}</p>}</Box></div>}</div>}
