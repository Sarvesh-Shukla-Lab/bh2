import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_PRODUCTS } from '../constants';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setProducts(INITIAL_PRODUCTS);
      } else {
        const fetchedProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(fetchedProducts);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Inventory Catalog</h1>
          <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">Precision Infrastructure <br/> & Components</h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3">
             <div className="sticky top-24 space-y-8">
               <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Search Products</label>
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-600 w-4 h-4 transition-colors" />
                    <input 
                      type="text"
                      placeholder="SKU or Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-medium transition-all"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">System Categories</label>
                  <div className="space-y-1">
                    {['Software', 'Cloud', 'Hardware'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSearchTerm(cat)}
                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-sm transition-all border ${searchTerm === cat ? 'bg-sky-50 text-sky-600 border-sky-100' : 'text-slate-500 border-transparent hover:bg-slate-100'}`}
                      >
                        {cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
               </div>
             </div>
          </aside>

          {/* Product Grid */}
          <section className="lg:col-span-9">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-sky-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-32 border border-dashed border-slate-200 rounded-sm bg-white">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">No matching components found</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Products;
