import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Headphones } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/utils';
import { INITIAL_SERVICES } from '../constants';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get('service') || '';
  const initialService = INITIAL_SERVICES.find(s => s.id === initialServiceId)?.name || '';

  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    service: initialService,
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      await addDoc(collection(db, 'serviceRequests'), {
        userId: user?.uid || null,
        userName: formData.name,
        userEmail: formData.email,
        serviceName: formData.service || 'General Inquiry',
        message: formData.message,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSent(true);
      setFormData({ ...formData, message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'serviceRequests');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white border-b border-slate-200 py-20 flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="max-w-2xl">
              <h1 className="text-xs font-black uppercase tracking-[0.4em] text-sky-600 mb-6">Service Portal</h1>
              <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-none tracking-tight">Direct Liaison <br/> & Support.</h2>
           </div>
           <div className="flex gap-12 text-right">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Direct Line</p>
                <p className="text-xl font-black text-slate-900">+1-800-BIZHUB</p>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 py-24 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
           {/* Inquiry Form */}
           <div className="lg:col-span-7">
              <div className="bg-white p-12 border border-slate-200 rounded-sm shadow-xl shadow-slate-100">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <CheckCircle2 className="w-16 h-16 text-sky-600 mx-auto mb-6" />
                      <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Transmission Successful</h3>
                      <p className="text-slate-500 font-medium mb-12">Our systems architect will review your message and contact you within 24 hours.</p>
                      <button onClick={() => setSent(false)} className="text-xs font-black text-sky-600 uppercase tracking-widest border-b-2 border-sky-600 pb-1">New Inquiry</button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit} 
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Identification Name</label>
                          <input 
                            required
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full p-3 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-sky-600 text-sm font-medium transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Email</label>
                          <input 
                            required
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full p-3 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-sky-600 text-sm font-medium transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category of Need</label>
                        <select 
                          value={formData.service}
                          onChange={(e) => setFormData({...formData, service: e.target.value})}
                          className="w-full p-3 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-sky-600 text-sm font-medium transition-all appearance-none bg-slate-50"
                        >
                          <option value="">General Support</option>
                          {INITIAL_SERVICES.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Message</label>
                        <textarea 
                          required
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder="Provide technical specifications or project goals..."
                          className="w-full p-3 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-sky-600 text-sm font-medium transition-all resize-none"
                        />
                      </div>
                      <button 
                        disabled={sending}
                        className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-black text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-lg shadow-sky-600/10"
                      >
                        {sending ? 'TRANSMITTING...' : 'SUBMIT SERVICE REQUEST'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
           </div>

           {/* Info sidebar */}
           <div className="lg:col-span-5 flex flex-col gap-12">
              <div className="p-8 bg-slate-900 rounded-sm text-white overflow-hidden relative">
                 <div className="relative z-10">
                    <Headphones className="w-8 h-8 text-sky-400 mb-6" />
                    <h4 className="text-xl font-bold uppercase tracking-tight mb-2">Rapid Response Team</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Our infrastructure specialists are monitored 24/7/365 to ensure sub-millisecond response times for critical failures.</p>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-sky-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
              </div>
              
              <div className="space-y-8">
                 <div className="flex items-center gap-6">
                    <div className="w-10 h-10 border border-slate-200 flex items-center justify-center text-slate-400 rounded-sm uppercase font-black text-[10px]">hq</div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Mainframe</p>
                       <p className="text-sm font-bold text-slate-900 leading-none">101 Silicon Valley, CA 94043</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="w-10 h-10 border border-slate-200 flex items-center justify-center text-slate-400 rounded-sm uppercase font-black text-[10px]">sec</div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Comms</p>
                       <p className="text-sm font-bold text-slate-900 leading-none">ops.shield@bizhub.com</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
