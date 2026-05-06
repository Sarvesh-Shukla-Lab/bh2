import React from 'react';
import { INITIAL_SERVICES } from '../constants';
import { ArrowRight, CheckCircle2, Sparkles, Zap, BarChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Services = () => {
  return (
    <div className="flex flex-col min-h-screen">
       <section className="bg-slate-900 text-white py-32 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-[10px] font-black text-sky-400 uppercase tracking-[0.4em] mb-6">Capabilities</h1>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-12">
              Bespoke Systems <br /> & Expert Consulting.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
              We specialize in full-stack infrastructure life cycles—from blueprinting and rapid prototyping to global scaling and maintenance.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {INITIAL_SERVICES.map((service, idx) => (
            <div key={service.id} className="flex gap-8 group">
              <div className="w-16 h-16 shrink-0 bg-white border border-slate-200 text-slate-800 flex items-center justify-center rounded-sm font-black text-2xl group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-all">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight mb-4 group-hover:text-sky-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                  {service.description} Our methodology ensures zero-latency deployment and maximum system resilience across any infrastructure environment.
                </p>
                <div className="space-y-3 mb-10">
                   {['ISO-Certified Standards', '24/7 Rapid Response', 'Dedicated Systems Lead'].map(feat => (
                     <div key={feat} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{feat}</span>
                     </div>
                   ))}
                </div>
                <Link to={`/contact?service=${service.id}`} className="inline-flex items-center gap-2 text-xs font-black text-sky-600 uppercase tracking-[0.2em] hover:gap-4 transition-all">
                  Request Specification <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-100 py-32 border-y border-slate-200">
         <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
           <div className="space-y-4">
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">"Operational excellence is not an act, but a habit in every blueprint."</h4>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">— Chief Systems Architect</p>
           </div>
           <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="p-8 bg-white border border-slate-200 rounded-sm">
                <p className="text-4xl font-extrabold text-slate-900 mb-2">99.99%</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Availability Target</p>
              </div>
              <div className="p-8 bg-white border border-slate-200 rounded-sm">
                <p className="text-4xl font-extrabold text-slate-900 mb-2">ISO-9001</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Certified Compliance</p>
              </div>
           </div>
         </div>
      </section>
    </div>
  );
};

export default Services;
