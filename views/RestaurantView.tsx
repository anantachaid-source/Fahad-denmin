
import React, { useState, useEffect } from 'react';
import { Booking } from '../types';

interface RestaurantViewProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
}

const RestaurantView: React.FC<RestaurantViewProps> = ({ bookings, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRE_ORDER'>('ALL');
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  useEffect(() => {
    if (lastNotification) {
      const timer = setTimeout(() => setLastNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastNotification]);

  const handleUpdateStatus = (id: string, status: Booking['status']) => {
    const booking = bookings.find(b => b.id === id);
    if (status === 'CALLED') {
        setLastNotification(`เรียกคิว ${booking?.queueNumber} ไปที่หน้าร้าน`);
    } else if (status === 'SEATED') {
        setLastNotification(`เช็คอินคิว ${booking?.queueNumber} เรียบร้อยแล้ว`);
    }
    onUpdateStatus(id, status);
  };

  const activeBookings = bookings.filter(b => b.status === 'WAITING' || b.status === 'CALLED');
  const seatedCount = bookings.filter(b => b.status === 'SEATED').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {lastNotification && (
        <div className="fixed top-24 right-6 z-[200] bg-slate-800/90 backdrop-blur-md text-white px-8 py-5 rounded-[2rem] shadow-2xl animate-in fade-in slide-in-from-right-8 flex items-center gap-4 border border-white/10">
            <div className="w-3 h-3 bg-sky-500 rounded-full animate-ping"></div>
            <p className="text-sm font-black tracking-tight">{lastNotification}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter">Merchant Dashboard</h2>
          <p className="text-slate-400 font-medium text-lg mt-1">Real-time control panel for TastyTable partners</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
          {[
            { label: 'Pending', value: activeBookings.length, color: 'sky' },
            { label: 'Checked In', value: seatedCount, color: 'green' },
            { label: 'Cancelled', value: bookings.filter(b => b.status === 'CANCELLED').length, color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center min-w-[120px]">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">{stat.label}</p>
              <p className={`text-4xl font-black text-${stat.color}-500 tracking-tighter`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
             <div className="px-10 py-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/20">
               <div className="flex gap-8">
                    <button 
                        onClick={() => setActiveTab('ALL')}
                        className={`text-xs font-black transition-all pb-2 border-b-4 uppercase tracking-widest ${activeTab === 'ALL' ? 'text-sky-500 border-sky-500' : 'text-slate-300 border-transparent hover:text-slate-400'}`}
                    >
                        Active Queues
                    </button>
                    <button 
                        onClick={() => setActiveTab('PRE_ORDER')}
                        className={`text-xs font-black transition-all pb-2 border-b-4 uppercase tracking-widest ${activeTab === 'PRE_ORDER' ? 'text-sky-500 border-sky-500' : 'text-slate-300 border-transparent hover:text-slate-400'}`}
                    >
                        Priority Pre-orders
                    </button>
               </div>
               <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Syncing</span>
               </div>
             </div>
             <div className="divide-y divide-slate-50">
               {activeBookings.length > 0 ? activeBookings
                 .filter(b => activeTab === 'ALL' || b.preOrderItems.length > 0)
                 .map((booking) => (
                 <div key={booking.id} className="p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 hover:bg-slate-50/50 transition-all duration-500 animate-in fade-in slide-in-from-left-4">
                   <div className="flex items-center gap-10">
                     <div className={`w-28 h-28 rounded-[2.5rem] flex flex-col items-center justify-center border-4 shadow-2xl transition-all duration-700 ${
                        booking.status === 'CALLED' ? 'bg-sky-500 border-sky-400 text-white scale-110 shadow-sky-200' : 'bg-white border-slate-50 text-slate-800'
                     }`}>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-2 ${booking.status === 'CALLED' ? 'text-sky-100' : 'text-slate-300'}`}>No.</span>
                        <span className="text-4xl font-black tracking-tighter">{booking.queueNumber}</span>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center gap-3">
                            <h4 className="font-black text-slate-800 text-2xl tracking-tight">{booking.customerName}</h4>
                            <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter">{booking.guestCount} Seats</span>
                       </div>
                       <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Waiting {Math.round((Date.now() - booking.timestamp.getTime()) / 60000)}m
                            </span>
                            {booking.preOrderItems.length > 0 && (
                                <span className="flex items-center gap-2 text-orange-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    ฿{booking.preOrderItems.reduce((s,i) => s + i.price * i.quantity, 0)}
                                </span>
                            )}
                       </div>
                       <div className="mt-4 flex flex-wrap gap-2">
                          {booking.preOrderItems.map((item, i) => (
                              <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-2xl">
                                 <img src={item.image} className="w-4 h-4 rounded-full object-cover" alt="" />
                                 <span className="text-[10px] font-black text-slate-500 uppercase">{item.name} x{item.quantity}</span>
                              </div>
                          ))}
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                     {booking.status === 'WAITING' ? (
                       <button 
                        onClick={() => handleUpdateStatus(booking.id, 'CALLED')}
                        className="bg-sky-500 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-sky-100 hover:bg-sky-600 transition-all hover:translate-y-[-4px] active:scale-95 flex items-center gap-3 group"
                       >
                         <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                         Call Customer
                       </button>
                     ) : (
                       <button 
                        onClick={() => handleUpdateStatus(booking.id, 'SEATED')}
                        className="bg-green-500 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-green-100 hover:bg-green-600 transition-all hover:translate-y-[-4px] active:scale-95 flex items-center gap-3"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         Check-In Table
                       </button>
                     )}
                     <button 
                        onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                        className="p-5 rounded-[2rem] bg-white border border-slate-100 text-slate-300 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                   </div>
                 </div>
               )) : (
                 <div className="p-24 text-center flex flex-col items-center space-y-4 opacity-30">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">All Queues Cleared</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="font-black text-xl flex items-center gap-3">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
                        Kitchen Hub
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Real-time</span>
                </div>
                <div className="space-y-6">
                    {bookings.filter(b => b.preOrderItems.length > 0 && b.status !== 'SEATED' && b.status !== 'CANCELLED').length > 0 ? (
                        bookings.filter(b => b.preOrderItems.length > 0 && b.status !== 'SEATED' && b.status !== 'CANCELLED').map(b => (
                        <div key={b.id} className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-black text-sky-400 text-lg">Q-{b.queueNumber}</p>
                                    <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">{b.customerName}</p>
                                </div>
                                <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full font-black uppercase tracking-tighter">On-Fire</span>
                            </div>
                            <div className="space-y-3">
                                {b.preOrderItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} className="w-8 h-8 rounded-lg object-cover opacity-80" alt="" />
                                        <span className="text-xs font-bold text-white/90">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-white/40">x{item.quantity}</span>
                                </div>
                                ))}
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="py-12 text-center opacity-20">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            <p className="text-[10px] font-black uppercase tracking-widest">No Active Orders</p>
                        </div>
                    )}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-sky-500/10 transition-all duration-700"></div>
           </div>

           <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/30 border border-slate-50">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-800 text-lg">Table Layout</h3>
                <span className="text-[10px] bg-green-100 text-green-600 px-3 py-1 rounded-full font-black tracking-widest uppercase">Optimized</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4,5,6,7,8].map(table => {
                   const isAvailable = table <= 3;
                   return (
                   <button 
                    key={table} 
                    className={`p-6 rounded-[2rem] border-4 font-black text-sm transition-all flex flex-col items-center justify-center gap-2 group ${
                      isAvailable 
                        ? 'bg-green-50/50 border-green-100 text-green-600 hover:bg-green-100 hover:border-green-200 hover:scale-105 shadow-sm' 
                        : 'bg-slate-50 border-slate-50 text-slate-200 cursor-not-allowed grayscale opacity-50'
                    }`}
                   >
                     <span className="text-[9px] opacity-40 uppercase tracking-[0.2em] font-black group-hover:opacity-60">Tab.</span>
                     <span className="text-2xl leading-none tracking-tighter">{table}</span>
                     <span className="text-[8px] font-black uppercase tracking-widest mt-1 bg-white px-2 py-0.5 rounded-full shadow-sm">{isAvailable ? 'Free' : 'Occupied'}</span>
                   </button>
                 )})}
              </div>
              <div className="mt-8 p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tap to manage seating plan</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantView;
