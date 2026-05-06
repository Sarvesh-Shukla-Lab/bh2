import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-24 border-t border-slate-800 shrink-0">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-sky-600 rounded-sm flex items-center justify-center font-black">B</div>
             <span className="text-xl font-bold tracking-tight uppercase">BizHub</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Precision infrastructure and technical components for the next generation of global enterprises.
          </p>
          <div className="flex gap-4 pt-4">
             {['T', 'L', 'G'].map(social => (
               <div key={social} className="w-8 h-8 border border-slate-700 flex items-center justify-center rounded-sm text-slate-400 hover:text-sky-400 hover:border-sky-400 cursor-pointer transition-all">
                  <span className="text-[10px] font-black uppercase tracking-tighter">{social}</span>
               </div>
             ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 underline decoration-sky-600 underline-offset-8 decoration-2 text-left">Ecosystem</h4>
          <ul className="space-y-4">
            <li><Link to="/products" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">Components</Link></li>
            <li><Link to="/services" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">Consultancy</Link></li>
            <li><Link to="/contact" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">Liaison</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 underline decoration-sky-600 underline-offset-8 decoration-2 text-left">Protocol</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">Legal Notice</a></li>
            <li><a href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">Privacy Shield</a></li>
            <li><a href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">Compliance</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 underline decoration-sky-600 underline-offset-8 decoration-2 text-left">Transmission</h4>
          <p className="text-slate-400 text-sm mb-6">Stay synchronized with our latest hardware releases and updates.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="ENTER EMAIL"
              className="bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-bold rounded-l-sm focus:outline-none focus:border-sky-600 w-full"
            />
            <button className="bg-sky-600 px-4 py-2 rounded-r-sm text-[10px] font-black uppercase tracking-widest hover:bg-sky-700 transition-colors">
              SYNC
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-24 pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© 2024 BizHub Global Systems Corp. All Rights Reserved.</p>
        <div className="flex items-center gap-1">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Master Server Online</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
