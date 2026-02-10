
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRole, onRoleChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe]">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onRoleChange('CUSTOMER')}>
            <div className="w-11 h-11 bg-sky-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-sky-100 rotate-3 hover:rotate-0 transition-transform duration-300">T</div>
            <div>
              <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none mb-0.5">TastyTable</h1>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] leading-none">Smart Queue v2.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-slate-100/50 p-1.5 rounded-2xl">
            {(['CUSTOMER', 'RESTAURANT', 'ADMIN'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  currentRole === role 
                    ? 'bg-white text-sky-600 shadow-md shadow-slate-200/50 translate-y-[-1px]' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {role === 'CUSTOMER' ? 'Client' : role === 'RESTAURANT' ? 'Merchant' : 'System'}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-grow animate-in fade-in duration-700">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-white font-black text-sm">T</div>
                <p className="text-xs font-black text-slate-800">TastyTable Project</p>
            </div>
            <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <a href="#" className="hover:text-sky-500 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-sky-500 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-sky-500 transition-colors">Contact Support</a>
            </div>
            <p className="text-[10px] text-slate-300 font-medium">
              &copy; 2024 Design for Academic Presentation Purposes Only.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
