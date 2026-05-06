import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  setDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Service, Order, ServiceRequest } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  MessageSquare, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Settings,
  Check,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/utils';

const Admin = () => {
  const { profile, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'orders' | 'requests' | 'settings'>('products');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [settings, setSettings] = useState<any>({ heroTitle: '', heroSubtitle: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    if (profile?.role !== 'admin') return;

    const unsubP = onSnapshot(query(collection(db, 'products'), orderBy('name')), (s) => 
      setProducts(s.docs.map(d => ({ id: d.id, ...d.data() } as Product))));
    
    const unsubS = onSnapshot(query(collection(db, 'services'), orderBy('name')), (s) => 
      setServices(s.docs.map(d => ({ id: d.id, ...d.data() } as Service))));
      
    const unsubO = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (s) => 
      setOrders(s.docs.map(d => ({ id: d.id, ...d.data() } as Order))));
      
    const unsubR = onSnapshot(query(collection(db, 'serviceRequests'), orderBy('createdAt', 'desc')), (s) => 
      setRequests(s.docs.map(d => ({ id: d.id, ...d.data() } as ServiceRequest))));

    const unsubSet = onSnapshot(doc(db, 'settings', 'global'), (d) => {
      if (d.exists()) setSettings(d.data());
    });

    return () => { unsubP(); unsubS(); unsubO(); unsubR(); unsubSet(); };
  }, [profile]);

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-8 py-32 text-center">
        <div className="max-w-md mx-auto bg-white p-12 border border-slate-200 shadow-xl">
           <Zap className="w-16 h-16 text-slate-200 mx-auto mb-8" />
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Admin Hub Access</h2>
           <p className="text-slate-500 font-medium mb-10">Unauthorized access detected. Please authenticate with administrator credentials.</p>
           <button onClick={login} className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest">Identify Administrator</button>
        </div>
      </div>
    );
  }

  const handleDelete = async (coll: string, id: string) => {
    if (window.confirm('Confirm permanent deletion?')) {
      try {
        await deleteDoc(doc(db, coll, id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, coll);
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'orders');
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert('CMS Updated Successfully');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings');
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div>
            <h1 className="text-xs font-black uppercase tracking-[0.4em] text-sky-600 mb-2">Central Ops</h1>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Admin Dashboard</h2>
          </div>
          <div className="flex gap-2">
            {(activeTab === 'products' || activeTab === 'services') && (
              <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-sky-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add New {activeTab === 'products' ? 'Product' : 'Service'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 py-12 flex-1 flex flex-col md:flex-row gap-12">
        {/* Navigation */}
        <aside className="md:w-64 space-y-2">
          <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package className="w-4 h-4"/>} label="Products" />
          <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Settings className="w-4 h-4"/>} label="Services" />
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ClipboardList className="w-4 h-4"/>} label="Orders" />
          <TabButton active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} icon={<MessageSquare className="w-4 h-4"/>} label="Inquiries" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<LayoutDashboard className="w-4 h-4"/>} label="CMS Settings" />
        </aside>

        {/* Content */}
        <main className="flex-1 bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
          {activeTab === 'products' && (
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">Component</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">{p.name}</td>
                      <td className="px-6 py-4 text-sky-600 font-bold text-sm">${p.price}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{p.category}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditingItem(p); setIsModalOpen(true); }} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-sky-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete('products', p.id)} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="p-0">
               <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">Service Capability</th>
                    <th className="px-6 py-4 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">{s.name}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditingItem(s); setIsModalOpen(true); }} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-sky-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete('services', s.id)} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="p-0">
               <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">Order Unit</th>
                    <th className="px-6 py-4">Recipient Info</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-sm">{o.productName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">QTY: {o.quantity} | Total: ${o.totalPrice}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-700">{o.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{o.customerPhone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border ${
                          o.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          o.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                          'bg-slate-50 text-red-600 border-red-100'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          className="text-[10px] font-black uppercase tracking-widest border border-slate-200 p-1"
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="pending">PENDING</option>
                          <option value="completed">COMPLETED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="p-8 space-y-6">
              {requests.map(r => (
                <div key={r.id} className="p-6 bg-slate-50 border border-slate-100 rounded-sm">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xs font-black text-sky-600 uppercase tracking-widest mb-1">{r.serviceName}</h4>
                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{r.userName}</p>
                        <p className="text-xs font-bold text-slate-400 font-mono">{r.userEmail}</p>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">Received: {r.createdAt?.toDate?.().toLocaleDateString()}</span>
                   </div>
                   <p className="text-slate-600 font-medium text-sm border-l-2 border-slate-200 pl-4">{r.message}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsUpdate} className="p-8 space-y-8 max-w-xl">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Hero Configuration</label>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Title</label>
                      <input 
                        className="w-full p-2 border border-slate-200 rounded-sm font-bold text-slate-800"
                        value={settings.heroTitle}
                        onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Supportive Text</label>
                      <textarea 
                        className="w-full p-2 border border-slate-200 rounded-sm font-medium text-slate-600 text-sm resize-none h-24"
                        value={settings.heroSubtitle}
                        onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})}
                      />
                    </div>
                  </div>
               </div>
               <button className="px-8 py-3 bg-sky-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm shadow-xl shadow-sky-600/10">
                  Update Platform CMS
               </button>
            </form>
          )}
        </main>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-lg rounded-sm p-8 shadow-2xl">
               <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingItem ? 'Edit' : 'Add'} {activeTab === 'products' ? 'Product' : 'Service'}</h3>
                  <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
               </div>
               
               <form className="space-y-6" onSubmit={async (e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const data = Object.fromEntries(formData.entries());
                 if (activeTab === 'products') {
                   const pData = {
                     name: data.name as string,
                     description: data.description as string,
                     price: parseFloat(data.price as string),
                     category: data.category as string,
                     imageUrl: data.imageUrl as string
                   };
                   try {
                     if (editingItem) await updateDoc(doc(db, 'products', editingItem.id), pData);
                     else await addDoc(collection(db, 'products'), pData);
                     setIsModalOpen(false);
                   } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'products'); }
                 } else if (activeTab === 'services') {
                   const sData = {
                     name: data.name as string,
                     description: data.description as string,
                     iconName: 'Zap'
                   };
                   try {
                     if (editingItem) await updateDoc(doc(db, 'services', editingItem.id), sData);
                     else await addDoc(collection(db, 'services'), sData);
                     setIsModalOpen(false);
                   } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'services'); }
                 }
               }}>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Name / Title</label>
                    <input name="name" required defaultValue={editingItem?.name} className="w-full p-2 border border-slate-200 rounded-sm font-bold text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
                    <textarea name="description" required defaultValue={editingItem?.description} className="w-full p-2 border border-slate-200 rounded-sm text-sm" rows={4} />
                  </div>
                  {activeTab === 'products' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</label>
                          <input name="price" type="number" step="0.01" required defaultValue={editingItem?.price} className="w-full p-2 border border-slate-200 rounded-sm font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category</label>
                          <select name="category" defaultValue={editingItem?.category || 'Software'} className="w-full p-2 border border-slate-200 rounded-sm font-bold">
                            <option>Software</option>
                            <option>Hardware</option>
                            <option>Cloud</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Image URL</label>
                        <input name="imageUrl" defaultValue={editingItem?.imageUrl} className="w-full p-2 border border-slate-200 rounded-sm text-xs font-mono" />
                      </div>
                    </>
                  )}
                  <button className="w-full py-4 bg-sky-600 text-white font-black text-xs uppercase tracking-widest rounded-sm shadow-xl shadow-sky-600/10 transition-transform active:scale-95">Save Specifications</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all border ${active ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-600/20' : 'text-slate-500 hover:bg-white border-transparent hover:border-slate-100'}`}
  >
    {icon} {label}
  </button>
);

export default Admin;
