const tok=()=>localStorage.getItem('ns_token');
export async function api(path,{method='GET',body,form}={}){
 const h={};if(tok())h.Authorization='Bearer '+tok();if(body)h['Content-Type']='application/json';
 const r=await fetch('/api'+path,{method,headers:h,body:form||(body&&JSON.stringify(body))});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(new Error(d.message||'Request failed'),{data:d,status:r.status});return d}
export const LOCALITIES=['Rohini','Dwarka','Saket','Karol Bagh','Lajpat Nagar','Janakpuri','Uttam Nagar','Connaught Place','Shahdara','Pitampura','Other'];
export const CATEGORIES=['Garbage & Waste','Road Damage & Potholes','Water Leakage','Streetlight','Drainage & Sewage','Electricity','Public Sanitation','Other'];
export const STATUSES=['Submitted','Under Review','Assigned','In Progress','Resolved','Rejected'];
