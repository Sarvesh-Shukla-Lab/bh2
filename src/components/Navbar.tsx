import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { user, profile, login, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="h-16 flex items-center bg-white border-b border-slate-200 sticky top-0 z-50 shrink-0">
      <div className="max-w-7xl mx-auto w-full px-8 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-600 rounded-sm flex items-center justify-center text-white font-bold">B</div>
            <span className="text-xl font-bold tracking-tight text-slate-800 uppercase">BizHub</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">Products</Link>
            <Link to="/services" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">Services</Link>
            <Link to="/contact" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">Contact</Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/orders" className="text-slate-500 hover:text-sky-600 transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </Link>
              <div className="h-6 w-[1px] bg-slate-200"></div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 uppercase font-medium">Welcome, {user.displayName?.split(' ')[0] || 'User'}</span>
                <button 
                  onClick={logout}
                  className="px-4 py-1.5 text-sm font-bold bg-slate-900 text-white rounded-sm hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={login}
              className="px-6 py-2 text-sm font-bold bg-sky-600 text-white rounded-sm hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 uppercase tracking-wider"
            >
              Sign In
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-4 md:hidden space-y-2 shadow-xl"
          >
            <Link to="/products" className="block px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 rounded" onClick={() => setIsOpen(false)}>PRODUCTS</Link>
            <Link to="/services" className="block px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 rounded" onClick={() => setIsOpen(false)}>SERVICES</Link>
            <Link to="/contact" className="block px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 rounded" onClick={() => setIsOpen(false)}>CONTACT</Link>
            {user ? (
              <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded">LOGOUT</button>
            ) : (
              <button onClick={() => { login(); setIsOpen(false); }} className="w-full py-4 text-sm font-bold bg-sky-600 text-white rounded">SIGN IN</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
