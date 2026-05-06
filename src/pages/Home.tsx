import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, CheckCircle2, MessageSquare, Zap, Globe, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { INITIAL_PRODUCTS, INITIAL_SERVICES } from '../constants';
import ProductCard from '../components/ProductCard';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Home = () => {
  const [settings, setSettings] = useState({
    heroTitle: 'Global Engineering & Precision Logistics',
    heroSubtitle: 'Providing enterprise-grade infrastructure components and specialized consulting for over 15 years. Quality, reliability, and innovation in every order.'
  });

  useEffect(() => {
    return onSnapshot(doc(db, 'settings', 'global'), (d) => {
      if (d.exists()) setSettings(prev => ({ ...prev, ...d.data() }));
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1] whitespace-pre-line">
                {settings.heroTitle}
              </h1>
              <p className="text-slate-500 max-w-xl text-lg leading-relaxed mb-10">
                {settings.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-sm hover:bg-slate-800 transition-all uppercase tracking-wider text-sm shadow-xl shadow-slate-900/10">
                  Explore Products
                </Link>
                <Link to="/services" className="px-8 py-3 border border-slate-200 text-slate-600 font-bold rounded-sm hover:bg-slate-50 transition-all uppercase tracking-wider text-sm">
                  Our Services
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="flex-1 w-full flex justify-center">
            <div className="relative w-full aspect-square max-w-md bg-slate-100 rounded-sm overflow-hidden shadow-2xl skew-x-1">
               <img 
                 src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" 
                 alt="Engineering" 
                 className="w-full h-full object-cover grayscale brightness-75 contrast-125"
               />
               <div className="absolute inset-0 bg-sky-600/10 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section split */}
      <div className="max-w-7xl mx-auto w-full px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mt-20">
          {/* Left Panel: Products */}
          <section className="md:col-span-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Featured Product Catalog</h2>
              <Link to="/products" className="text-sky-600 text-xs font-bold hover:underline flex items-center gap-1">
                VIEW ALL <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {INITIAL_PRODUCTS.slice(0, 2).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Right Panel: Services list */}
          <aside className="md:col-span-4">
            <div className="border-b border-slate-200 mb-8 pb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Our Specialties</h2>
            </div>
            <div className="space-y-6">
              {INITIAL_SERVICES.map((service, idx) => (
                <div key={service.id} className="flex gap-6 p-4 border border-transparent hover:border-slate-100 hover:bg-white rounded-sm group transition-all">
                  <div className="w-12 h-12 shrink-0 bg-slate-100 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 flex items-center justify-center rounded-sm font-black transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors uppercase tracking-tight text-sm">{service.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="bg-sky-600 p-8 rounded-sm text-white shadow-lg shadow-sky-600/20">
                <h3 className="text-xl font-bold mb-2">Need a custom quote?</h3>
                <p className="text-sky-100 text-sm mb-6">Our experts are ready to discuss your specific infrastructure needs.</p>
                <Link to="/contact" className="w-full block py-3 bg-white text-sky-600 text-center font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-sky-50 transition-colors">
                  Submit Inquiry
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
