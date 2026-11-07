import {t} from '../i18n.jsx';import {useEffect,useState} from 'react';import {MapContainer,TileLayer,CircleMarker,Popup,useMap} from 'react-leaflet';import {Link} from 'react-router-dom';import {api,CATEGORIES} from '../api.js';
const COL={Submitted:'#2563eb','Under Review':'#7c3aed',Assigned:'#0891b2','In Progress':'#d97706',Resolved:'#16a34a',Rejected:'#dc2626'};
const AREA={Rohini:[28.7380,77.0822],Dwarka:[28.5921,77.046],Saket:[28.5245,77.2066],'Karol Bagh':[28.6519,77.1909],'Lajpat Nagar':[28.5677,77.2433],Janakpuri:[28.6219,77.0878],'Uttam Nagar':[28.6195,77.0550],'Connaught Place':[28.6315,77.2167],Shahdara:[28.6735,77.2890],Pitampura:[28.7033,77.1319]};
const Fly=({to})=>{const m=useMap();useEffect(()=>{to&&m.flyTo(to,14)},[to]);return null};
const km=(a,b)=>{const r=x=>x*Math.PI/180,d=Math.sin(r(b[0]-a[0])/2)**2+Math.cos(r(a[0]))*Math.cos(r(b[0]))*Math.sin(r(b[1]-a[1])/2)**2;return 12742*Math.asin(Math.sqrt(d))};
export default function MapPage(){const[items,setItems]=useState(null);const[cat,setCat]=useState('');const[loc,setLoc]=useState('');const[me,setMe]=useState(null);const[err,setErr]=useState('');
 useEffect(()=>{api('/complaints?limit=100').then(d=>setItems(d.items)).catch(e=>setErr(e.message))},[]);
 const find=e=>{e.preventDefault();const k=Object.keys(AREA).find(a=>a.toLowerCase().includes(loc.trim().toLowerCase()));k?setMe(AREA[k]):setErr('Locality not found. Try Rohini, Dwarka, Saket and similar.')};
 const here=()=>navigator.geolocation?.getCurrentPosition(p=>setMe([p.coords.latitude,p.coords.longitude]),()=>setErr('Location permission denied.'));
 const shown=(items||[]).filter(c=>!cat||c.category===cat);const near=me?shown.map(c=>({c,d:km(me,[c.location.coordinates[1],c.location.coordinates[0]])})).filter(x=>x.d<=2).sort((a,b)=>a.d-b.d):[];
 return <div className="space-y-4"><h1 className="text-3xl font-bold text-navy">{t("Delhi problem map")}</h1>
  <div className="flex flex-wrap gap-3"><select className="inp !w-auto" aria-label="Category" value={cat} onChange={e=>setCat(e.target.value)}><option value="">{t("All categories")}</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
   <form onSubmit={find} className="flex gap-2"><input className="inp" placeholder="Search a locality" value={loc} onChange={e=>setLoc(e.target.value)}/><button className="btn-s">{t("Search")}</button></form><button className="btn-s" onClick={here}>{t("Near me")}</button></div>
  {err&&<p role="alert" className="text-red-700">{err}</p>}
  <div className="flex flex-wrap gap-3 text-sm">{Object.entries(COL).map(([s,c])=><span key={s}><i className="mr-1 inline-block h-3 w-3 rounded-full" style={{background:c}}/>{t(s)}</span>)}</div>
  <MapContainer center={[28.6139,77.209]} zoom={11} className="h-[28rem] rounded-xl"><TileLayer attribution="© OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/><Fly to={me}/>
   {shown.map(c=><CircleMarker key={c.id} center={[c.location.coordinates[1],c.location.coordinates[0]]} radius={9} pathOptions={{color:'#fff',weight:2,fillColor:COL[c.status],fillOpacity:.95}}>
    <Popup><b>{c.title}</b><br/>{c.category} · {c.locality}<br/>{c.status} · {c.votes} supporters<br/><Link to={'/complaint/'+c.complaintId}>View details</Link></Popup></CircleMarker>)}</MapContainer>
  {items&&!items.length&&<p>No complaints have been reported yet, so the map is empty.</p>}
  {me&&<div><h2 className="font-bold text-navy">{t("Reported within 2 km")}</h2>{near.length?<ul className="list-disc pl-5">{near.map(({c,d})=><li key={c.id}><Link className="text-teal underline" to={'/complaint/'+c.complaintId}>{c.title}</Link> ({d.toFixed(1)} km)</li>)}</ul>:<p>No reported issues nearby.</p>}</div>}</div>}
