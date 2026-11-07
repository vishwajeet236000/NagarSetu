import {t} from '../i18n.jsx';import {useState} from 'react';import {useNavigate} from 'react-router-dom';import {MapContainer,TileLayer,Marker,useMapEvents} from 'react-leaflet';import L from 'leaflet';import {api,CATEGORIES,LOCALITIES} from '../api.js';
const icon=L.divIcon({html:'<div style="width:18px;height:18px;border-radius:50%;background:#0f8b8d;border:3px solid #fff;box-shadow:0 0 0 2px #0f2a4a"></div>',iconSize:[18,18],className:''});
const Pick=({set})=>{useMapEvents({click:e=>set([e.latlng.lat,e.latlng.lng])});return null};
export default function Report(){const nav=useNavigate();const[pos,setPos]=useState(null);const[files,setFiles]=useState([]);const[err,setErr]=useState('');const[dupes,setDupes]=useState(null);const[busy,setBusy]=useState(false);const[done,setDone]=useState(null);
 const locate=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>setPos([p.coords.latitude,p.coords.longitude]),()=>setErr('Location permission denied. Tap the map to pick the spot instead.')):setErr('Geolocation is not supported. Tap the map instead.');
 const submit=async(e,force)=>{e?.preventDefault();const f=new FormData(document.getElementById('rf'));files.forEach(x=>f.append('images',x));
  if(!pos)return setErr('Tap the map or use your current location.');f.set('lat',pos[0]);f.set('lng',pos[1]);setBusy(true);setErr('');
  try{setDone(await api('/complaints'+(force?'?force=1':''),{method:'POST',form:f}))}catch(x){x.status===409&&x.data.similar?setDupes(x.data.similar):setErr(x.message)}setBusy(false)};
 if(done)return <div className="mx-auto max-w-md rounded-xl bg-white p-6 text-center shadow-sm"><h1 className="text-2xl font-bold text-navy">{t("Complaint submitted")}</h1><p className="my-3">Your complaint ID is <b>{done.complaintId}</b>.</p><button className="btn-p" onClick={()=>nav('/complaint/'+done.complaintId)}>{t("Track progress")}</button></div>;
 return <form id="rf" onSubmit={submit} className="mx-auto grid max-w-3xl gap-4 rounded-xl bg-white p-6 shadow-sm"><h1 className="text-3xl font-bold text-navy">{t("Report an issue")}</h1>
  <label>{t("Title")}<input name="title" required maxLength={120} className="inp"/></label><label>{t("Description")}<textarea name="description" required rows={4} className="inp"/></label>
  <div className="grid gap-4 md:grid-cols-2"><label>{t("Category")}<select name="category" required className="inp">{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
   <label>{t("Locality")}<select name="locality" required className="inp">{LOCALITIES.map(c=><option key={c}>{c}</option>)}</select></label></div>
  <label>{t("Full address")}<input name="address" required className="inp"/></label><label>{t("Contact number (private)")}<input name="contactPhone" inputMode="numeric" className="inp"/></label>
  <label>{t("Photos (up to 4, JPG/PNG/WebP, 5 MB each)")}<input type="file" accept="image/jpeg,image/png,image/webp" multiple required className="inp" onChange={e=>setFiles([...e.target.files].slice(0,4))}/></label>
  <div className="flex flex-wrap gap-2">{files.map(x=><img key={x.name} src={URL.createObjectURL(x)} alt={x.name} className="h-20 rounded-lg"/>)}</div>
  <div><button type="button" className="btn-s mb-2" onClick={locate}>{t("Use my current location")}</button>
   <MapContainer center={[28.6139,77.209]} zoom={11} className="h-72 rounded-lg"><TileLayer attribution="© OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/><Pick set={setPos}/>{pos&&<Marker position={pos} icon={icon}/>}</MapContainer></div>
  {err&&<p role="alert" className="text-red-700">{err}</p>}
  {dupes&&<div role="alert" className="rounded-lg bg-amber-50 p-3">Similar open complaints nearby: {dupes.map(d=><a key={d.id} className="mx-1 text-teal underline" href={'/complaint/'+d.complaintId}>{d.complaintId}</a>)}<button type="button" className="btn-s mt-2" onClick={()=>submit(null,true)}>Submit anyway</button></div>}
  <button className="btn-p" disabled={busy}>{busy?t('Submitting…'):t('Submit complaint')}</button></form>}
