import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthContext';
import { Order } from '../types';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

const Orders = () => {
  const { user, login } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-32 text-center">
        <div className="max-w-md mx-auto bg-white p-12 border border-slate-200 rounded-sm shadow-xl">
          <div className="w-16 h-16 bg-slate-100 rounded-sm flex items-center justify-center text-slate-400 mx-auto mb-8">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Account Access Required</h2>
          <p className="text-slate-500 font-medium mb-10 text-sm">Please identify yourself to access secure transaction history.</p>
          <button 
            onClick={login}
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-sm transition-all shadow-lg shadow-sky-600/10 uppercase tracking-widest text-xs"
          >
            Authenticate with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Transaction Ledger</h1>
          <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">Order Specifications</h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 py-16 flex-1">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-sky-600 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-sm border border-slate-100 shadow-sm">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-6" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Vault is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 border border-slate-200 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-sky-300 transition-colors group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-sm shrink-0 group-hover:bg-sky-600 transition-colors">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 uppercase tracking-tight">{order.productName}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-1">
                      <span className="uppercase tracking-widest font-mono">#{order.id.slice(0, 8)}</span>
                      <span className="flex items-center gap-1 uppercase">
                        <Clock className="w-3 h-3" />
                        {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'MMM dd, yyyy') : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto border-t md:border-t-0 border-slate-50 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Total Valuation</p>
                    <p className="text-xl font-black text-slate-900">${order.totalPrice.toLocaleString()}</p>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm font-black text-[10px] uppercase tracking-widest ${
                    order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    order.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                    'bg-slate-50 text-red-600 border-red-100'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for classNames
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default Orders;
