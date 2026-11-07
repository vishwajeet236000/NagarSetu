import React,{useState,useEffect,createContext,useContext} from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter,Routes,Route,Link,Navigate,useNavigate} from 'react-router-dom';
import {Landmark,Moon,Sun} from 'lucide-react';import './index.css';import {api} from './api.js';import {I18n,useT} from './i18n.jsx';import Bell from './Bell.jsx';
import Home from './pages/Home.jsx';import Report from './pages/Report.jsx';import Explore from './pages/Explore.jsx';import Track from './pages/Track.jsx';import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';import Admin from './pages/Admin.jsx';import MapPage from './pages/MapPage.jsx';import Transparency from './pages/Transparency.jsx';import Forgot from './pages/Forgot.jsx';
const Ctx=createContext();export const useAuth=()=>useContext(Ctx);
function Shell(){const[user,setUser]=useState(null);const[ready,setReady]=useState(false);const nav=useNavigate();const{t,lang,set}=useT();
 const[dark,setDark]=useState(()=>{try{return localStorage.getItem('ns_dark')==='1'}catch{return false}});
 useEffect(()=>{document.documentElement.classList.toggle('dark',dark);try{localStorage.setItem('ns_dark',dark?'1':'0')}catch{}},[dark]);
 useEffect(()=>{localStorage.getItem('ns_token')?api('/auth/me').then(setUser).catch(()=>localStorage.removeItem('ns_token')).finally(()=>setReady(true)):setReady(true)},[]);
 const login=({token,user})=>{localStorage.setItem('ns_token',token);setUser(user);nav('/')};
 const logout=()=>{localStorage.removeItem('ns_token');setUser(null);nav('/')};
 const staff=user&&['admin','staff'].includes(user.role);if(!ready)return null;
 return <Ctx.Provider value={{user,login}}>
  <header className="bg-navy text-white"><nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3" aria-label="Main">
   <Link to="/" className="mr-auto flex items-center gap-2 text-lg font-bold"><Landmark size={22}/>NagarSetu</Link>
   <Link to="/report">{t('Report an issue')}</Link><Link to="/explore">{t('Explore issues')}</Link><Link to="/map">{t('Map')}</Link><Link to="/transparency">{t('Transparency')}</Link>
   {user&&<Link to="/dashboard">{t('My dashboard')}</Link>}{staff&&<Link to="/admin">{t('Admin')}</Link>}
   <button onClick={()=>set(lang==='en'?'hi':'en')} aria-label="Switch language" className="rounded border border-white/40 px-2 text-sm">{lang==='en'?'हिन्दी':'EN'}</button>
   <button onClick={()=>setDark(!dark)} aria-label={dark?'Switch to light mode':'Switch to dark mode'}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
   {user&&<Bell/>}{user?<button onClick={logout} className="underline">{t('Log out')}</button>:<Link to="/login" className="rounded-lg bg-teal px-3 py-1.5">{t('Log in')}</Link>}</nav></header>
  <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8"><Routes key={lang}>
   <Route path="/" element={<Home/>}/><Route path="/explore" element={<Explore/>}/><Route path="/map" element={<MapPage/>}/><Route path="/complaint/:id" element={<Track/>}/>
   <Route path="/report" element={user?<Report/>:<Navigate to="/login"/>}/><Route path="/dashboard" element={user?<Dashboard/>:<Navigate to="/login"/>}/>
   <Route path="/admin" element={staff?<Admin/>:<Navigate to="/login"/>}/><Route path="/transparency" element={<Transparency/>}/><Route path="/login" element={<Auth/>}/><Route path="/forgot" element={<Forgot/>}/><Route path="/reset/:token" element={<Forgot/>}/></Routes></main>
  <footer className="bg-navy py-6 text-center text-sm text-white/70">NagarSetu is an independent citizen platform and is not affiliated with any government body.</footer></Ctx.Provider>}
createRoot(document.getElementById('root')).render(<BrowserRouter><I18n><Shell/></I18n></BrowserRouter>);
