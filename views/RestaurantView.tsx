
import React, { useState, useEffect, useRef } from 'react';
import { Booking } from '../types';

interface RestaurantViewProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
}

const RestaurantView: React.FC<RestaurantViewProps> = ({ bookings, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRE_ORDER'>('ALL');
  const [notification, setNotification] = useState<string | null>(null);
  const prevBookingsCount = useRef(bookings.length);

  // ตรวจสอบเมื่อมีการจองใหม่เข้ามา (Simulation Real-time)
  useEffect(() => {
    if (bookings.length > prevBookingsCount.current) {
      const newBooking = bookings[bookings.length - 1];
      setNotification(`คิวใหม่! ${newBooking.queueNumber} (${newBooking.customerName}) จองเข้ามาแล้ว`);
      prevBookingsCount.current = bookings.length;
    }
  }, [bookings]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleUpdateStatus = (id: string, status: Booking['status']) => {
    const booking = bookings.find(b => b.id === id);
    if (status === 'CALLED') {
      setNotification(`เรียกคิว ${booking?.queueNumber} เรียบร้อยแล้ว`);
    } else if (status === 'SEATED') {
      setNotification(`เช็คอินคิว ${booking?.queueNumber} เข้าโต๊ะแล้ว`);
    }
    onUpdateStatus(id, status);
  };

  const activeBookings = bookings.filter(b => b.status === 'WAITING' || b.status === 'CALLED');
  const seatedCount = bookings.filter(b => b.status === 'SEATED').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Real-time Notification Pop-up */}
      {notification && (
        <div className="fixed top-24 right-6 z-[200] bg-slate-800 text-white px-8 py-5 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-right-8 flex items-center gap-4 border border-slate-700">
            <div className="w-3 h-3 bg-sky-500 rounded-full animate-ping"></div>
            <p className="text-sm font-black tracking-tight">{notification}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter">Merchant Hub</h2>
          <p className="text-slate-400 font-medium text-lg mt-1">ระบบจัดการคิวและออเดอร์หลังบ้าน</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
          {[
            { label: 'รอดำเนินการ', value: activeBookings.length, color: 'sky' },
            { label: 'เช็คอินแล้ว', value: seatedCount, color: 'green' },
            { label: 'ยกเลิก', value: bookings.filter(b => b.status === 'CANCELLED').length, color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center min-w-[130px]">
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
                        คิวทั้งหมด
                    </button>
                    <button 
                        onClick={() => setActiveTab('PRE_ORDER')}
                        className={`text-xs font-black transition-all pb-2 border-b-4 uppercase tracking-widest ${activeTab === 'PRE_ORDER' ? 'text-sky-500 border-sky-500' : 'text-slate-300 border-transparent hover:text-slate-400'}`}
                    >
                        รายการพรีออเดอร์
                    </button>
               </div>
               <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">เชื่อมต่อแล้ว</span>
               </div>
             </div>
             
             <div className="divide-y divide-slate-50">
               {activeBookings.length > 0 ? activeBookings
                 .filter(b => activeTab === 'ALL' || b.preOrderItems.length > 0)
                 .map((booking) => (
                 <div key={booking.id} className="p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 hover:bg-slate-50/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
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
                            <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter">{booking.guestCount} ท่าน</span>
                       </div>
                       <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                รอแล้ว {Math.round((Date.now() - booking.timestamp.getTime()) / 60000)} นาที
                            </span>
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
                         เรียกคิว
                       </button>
                     ) : (
                       <button 
                        onClick={() => handleUpdateStatus(booking.id, 'SEATED')}
                        className="bg-green-500 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-green-100 hover:bg-green-600 transition-all hover:translate-y-[-4px] active:scale-95 flex items-center gap-3"
                       >
                         เข้าโต๊ะ
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
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">ยังไม่มีคิวในระบบ</p>
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
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        Kitchen Hub
                    </h3>
                </div>
                <div className="space-y-6">
                    {bookings.filter(b => b.preOrderItems.length > 0 && b.status !== 'SEATED' && b.status !== 'CANCELLED').length > 0 ? (
                        bookings.filter(b => b.preOrderItems.length > 0 && b.status !== 'SEATED' && b.status !== 'CANCELLED').map(b => (
                        <div key={b.id} className="bg-white/5 rounded-3xl p-6 border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-black text-sky-400 text-lg">Q-{b.queueNumber}</p>
                                    <p className="text-[9px] text-white/30 uppercase font-black">{b.customerName}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {b.preOrderItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                                    <span className="text-xs font-bold text-white/90">{item.name}</span>
                                    <span className="text-xs font-black text-white/40">x{item.quantity}</span>
                                </div>
                                ))}
                            </div>
                        </div>
                        ))
                    ) : (
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 text-center py-10">ไม่มีออเดอร์ค้าง</p>
                    )}
                </div>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/30 border border-slate-50">
              <h3 className="font-black text-slate-800 text-lg mb-8">Table Layout</h3>
              <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4,5,6,7,8].map(table => {
                   const isAvailable = table <= 3;
                   return (
                   <div 
                    key={table} 
                    className={`p-6 rounded-[2rem] border-4 font-black text-sm flex flex-col items-center justify-center gap-2 ${
                      isAvailable ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-50 border-slate-50 text-slate-200 opacity-50'
                    }`}
                   >
                     <span className="text-2xl tracking-tighter">{table}</span>
                     <span className="text-[8px] font-black uppercase tracking-widest">{isAvailable ? 'ว่าง' : 'ไม่ว่าง'}</span>
                   </div>
                 )})}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantView;
