import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/utils';
import { motion } from 'motion/react';

import OrderModal from './OrderModal';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user, login } = useAuth();
  const [isOrderOpen, setIsOrderOpen] = React.useState(false);

  const handleOrderClick = () => {
    if (!user) {
      login();
      return;
    }
    setIsOrderOpen(true);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm hover:border-sky-300 transition-all group">
        <div className="w-full aspect-[4/3] bg-slate-100 rounded-sm mb-4 flex items-center justify-center overflow-hidden">
          <img 
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-bold text-slate-800 tracking-tight">{product.name}</h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none">SKU: {product.id.slice(0, 6)}</p>
          </div>
          <span className="text-sky-600 font-bold block">${product.price.toLocaleString()}</span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 mt-2 h-8">
          {product.description}
        </p>
        <button 
          onClick={handleOrderClick}
          className="w-full mt-4 py-2 bg-slate-100 hover:bg-sky-600 hover:text-white transition-colors text-[10px] font-black tracking-widest rounded-sm uppercase"
        >
          ORDER NOW
        </button>
      </div>

      <OrderModal 
        product={product} 
        isOpen={isOrderOpen} 
        onClose={() => setIsOrderOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
