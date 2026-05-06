import React, { useState } from 'react';
import { Package, X, User, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ product, isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    address: '',
    quantity: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        productId: product.id,
        productName: product.name,
        quantity: formData.quantity,
        totalPrice: product.price * formData.quantity,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.3em] mb-1">Secure Transaction</p>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order Specification</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Verification Success</h3>
                <p className="text-slate-500 font-medium mb-12">Your order for {product.name} has been synchronized with our logistics hub.</p>
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-sm"
                >
                  Return to Catalog
                </button>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-sm mb-8">
                  <Package className="w-10 h-10 text-sky-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.category}</p>
                    <p className="font-bold text-slate-900">{product.name}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Price</p>
                    <p className="text-lg font-black text-sky-600">${product.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recipient Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-sm focus:ring-1 focus:ring-sky-600 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-sm focus:ring-1 focus:ring-sky-600 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                    <textarea 
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-sm focus:ring-1 focus:ring-sky-600 outline-none text-sm font-medium resize-none"
                      placeholder="Street address, city, zip code..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                      className="w-16 p-2 bg-slate-50 border border-slate-200 rounded-sm text-center text-sm font-black"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Valuation</p>
                    <p className="text-2xl font-black text-slate-900">${(product.price * formData.quantity).toLocaleString()}</p>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-black text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-lg shadow-sky-600/20"
                >
                  {loading ? 'SYNCHRONIZING...' : 'INITIALIZE PROCUREMENT'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderModal;
