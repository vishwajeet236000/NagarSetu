import {useEffect,useState} from 'react';import {Bell} from 'lucide-react';import {api} from './api.js';import {useT} from './i18n.jsx';
export default function NotificationBell(){const[d,setD]=useState({items:[],unread:0});const[open,setOpen]=useState(false);const{t}=useT();
 const load=()=>api('/notifications').then(setD).catch(()=>{});useEffect(()=>{load();const i=setInterval(load,30000);return()=>clearInterval(i)},[]);
 const read=async n=>{if(!n.isRead){await api(`/notifications/${n._id}/read`,{method:'PATCH'});load()}};
 return <div className="relative"><button aria-label={`${t('Notifications')}, ${d.unread} unread`} onClick={()=>setOpen(!open)} className="relative p-1"><Bell size={20}/>{d.unread>0&&<span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 text-xs">{d.unread}</span>}</button>
  {open&&<div className="absolute right-0 z-[1000] mt-2 max-h-80 w-72 overflow-auto rounded-xl bg-white p-2 text-slate-800 shadow-lg">{!d.items.length&&<p className="p-3 text-sm">No notifications yet.</p>}
   {d.items.map(n=><button key={n._id} onClick={()=>read(n)} className={'block w-full rounded-lg p-2 text-left text-sm hover:bg-slate-100 '+(n.isRead?'':'font-bold')}>{n.title}<span className="block font-normal text-slate-600">{n.message}</span></button>)}</div>}</div>}
