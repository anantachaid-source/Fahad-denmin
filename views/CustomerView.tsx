
import React, { useState, useEffect } from 'react';
import { Dish, CartItem, Booking } from '../types';
import { MOCK_DISHES } from '../constants';
import MenuGrid from '../components/MenuGrid';

interface CustomerViewProps {
  onAddBooking: (booking: Booking) => void;
  currentQueue: string;
}

const CustomerView: React.FC<CustomerViewProps> = ({ onAddBooking, currentQueue: initialCurrentQueue }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookingStatus, setBookingStatus] = useState<'IDLE' | 'PENDING' | 'BOOKED'>('IDLE');
  const [customerName, setCustomerName] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [myBooking, setMyBooking] = useState<Booking | null>(null);
  const [currentQueue, setCurrentQueue] = useState(initialCurrentQueue);

  useEffect(() => {
    setCurrentQueue(initialCurrentQueue);
  }, [initialCurrentQueue]);

  const handleAddToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing?.quantity === 1) {
        return prev.filter(item => item.id !== id);
      }
      return prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const handleBook = () => {
    if (!customerName.trim()) {
      alert('กรุณากรอกชื่อผู้จองเพื่อดำเนินการต่อ');
      return;
    }
    setBookingStatus('PENDING');
    setTimeout(() => {
      const qNum = 42 + Math.floor(Math.random() * 10);
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        queueNumber: `A-0${qNum}`,
        customerName,
        guestCount,
        status: 'WAITING',
        preOrderItems: cart,
        timestamp: new Date(),
        estimatedWaitMinutes: 25
      };
      setMyBooking(newBooking);
      onAddBooking(newBooking);
      setBookingStatus('BOOKED');
    }, 1200);
  };

  const filteredDishes = MOCK_DISHES.filter(dish => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const categories = ['ทั้งหมด', ...new Set(MOCK_DISHES.map(d => d.category))];

  if (bookingStatus === 'BOOKED' && myBooking) {
    const qDiff = parseInt(myBooking.queueNumber.split('-')[1]) - parseInt(currentQueue.split('-')[1]);
    
    return (
      <div className="max-w-xl mx-auto p-4 py-12">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-50 animate-in fade-in zoom-in-95 duration-700">
          <div className="relative h-48">
            <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover" alt="Success" />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-600 to-transparent"></div>
            <div className="absolute bottom-6 left-0 w-full text-center text-white px-6">
               <h2 className="text-2xl font-black mb-1">จองคิวสำเร็จ!</h2>
               <p className="text-sky-100 text-xs font-medium">คิวของคุณถูกบันทึกในระบบเรียบร้อยแล้ว</p>
            </div>
          </div>
          
          <div className="p-10">
            <div className="text-center mb-10">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">My Queue Number</p>
                <div className="text-8xl font-black text-sky-600 tracking-tighter drop-shadow-sm">{myBooking.queueNumber}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">กำลังเรียกคิว</p>
                <p className="text-3xl font-black text-slate-800">{currentQueue}</p>
              </div>
              <div className="bg-sky-50 rounded-3xl p-6 text-center border border-sky-100">
                <p className="text-[10px] text-sky-600 font-bold uppercase mb-1">คิวที่ต้องรอ</p>
                <p className="text-3xl font-black text-sky-700">{Math.max(0, qDiff)}</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center text-sm font-bold p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    สถานะการจอง
                 </div>
                 <span>กำลังรอโต๊ะ</span>
              </div>
              
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">รายการอาหารสั่งล่วงหน้า</h4>
                 {myBooking.preOrderItems.length > 0 ? (
                   <div className="space-y-4">
                     {myBooking.preOrderItems.map(item => (
                       <div key={item.id} className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-3">
                            <img src={item.image} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt={item.name} />
                            <span className="text-slate-700 font-bold">{item.name} <span className="text-slate-400 ml-1">x{item.quantity}</span></span>
                         </div>
                         <span className="font-black text-slate-900">฿{item.price * item.quantity}</span>
                       </div>
                     ))}
                     <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">ราคาสุทธิ</span>
                        <span className="text-2xl font-black text-red-600">฿{totalAmount}</span>
                     </div>
                   </div>
                 ) : (
                   <p className="text-xs text-slate-400 italic text-center py-4">ไม่มีรายการพรีออเดอร์</p>
                 )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
               <button onClick={() => { setBookingStatus('IDLE'); setCart([]); }} className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-xl shadow-slate-100">กลับไปหน้าหลัก</button>
               <button className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors py-2">ยกเลิกการจอง</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-10">
          <div className="relative h-80 rounded-[3rem] overflow-hidden shadow-2xl group">
             <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Restaurant Hero" />
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
             <div className="absolute inset-0 p-12 flex flex-col justify-center text-white">
                <span className="bg-sky-500 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full w-fit mb-4">Top Rated Restaurant</span>
                <h2 className="text-5xl font-black mb-2 tracking-tighter">TastyTable Bistro</h2>
                <p className="text-white/70 max-w-sm text-sm leading-relaxed font-light">สัมผัสประสบการณ์การทานอาหารระดับมิชลินสตาร์ พร้อมระบบจองคิวอัจฉริยะที่ช่วยให้คุณไม่ต้องรอนาน</p>
             </div>
          </div>

          <div className="sticky top-28 z-40 bg-[#fcfdfe]/90 backdrop-blur-md py-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder="ค้นหาเมนูโปรดของคุณที่นี่..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm focus:ring-2 focus:ring-sky-100 transition-all text-sm outline-none"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                                selectedCategory === cat ? 'bg-sky-500 text-white shadow-xl shadow-sky-100 translate-y-[-2px]' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                  </div>
              </div>
          </div>

          <MenuGrid 
            dishes={filteredDishes} 
            onAddToCart={handleAddToCart} 
            onRemoveFromCart={handleRemoveFromCart}
            cart={cart} 
          />
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 p-10 sticky top-28 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"></path></svg>
            </div>
            
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">สรุปการจอง</h3>
                <div className="w-10 h-10 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="กรอกชื่อของคุณ" 
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-800 outline-none ring-2 ring-transparent focus:ring-sky-100 focus:bg-white transition-all text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Guests Count</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[2, 4, 6, 8].map(count => (
                      <button 
                        key={count}
                        onClick={() => setGuestCount(count)}
                        className={`py-4 rounded-2xl font-black text-xs transition-all ${
                          guestCount === count ? 'bg-sky-500 text-white shadow-xl shadow-sky-100 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {count}{count === 8 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-8 border border-dashed border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Selected Menu</p>
                    <span className="text-[10px] font-black text-sky-600 bg-white px-3 py-1 rounded-full shadow-sm">{cart.length} ชนิด</span>
                </div>
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                           <img src={item.image} className="w-8 h-8 rounded-lg object-cover shadow-sm" alt={item.name} />
                           <span className="text-slate-600 font-bold truncate max-w-[100px]">{item.name}</span>
                           <span className="text-slate-300 ml-1 font-black">x{item.quantity}</span>
                        </div>
                        <span className="font-black text-slate-800">฿{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Amount</span>
                      <span className="text-3xl font-black text-red-600">฿{totalAmount}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-30">
                    <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <p className="text-[10px] text-slate-500 italic font-bold tracking-widest uppercase">Cart is Empty</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleBook}
                disabled={bookingStatus === 'PENDING'}
                className="group relative w-full bg-sky-500 text-white py-6 rounded-[2rem] font-black text-sm shadow-2xl shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                    {bookingStatus === 'PENDING' ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>กำลังสร้างคิวของคุณ...</span>
                        </>
                    ) : 'ยืนยันและจองคิวทันที'}
                </div>
                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
              </button>

              <div className="flex items-start gap-3 px-2">
                  <div className="mt-1 text-sky-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tighter">
                    Important: Please arrive 10-15 minutes before your queue number is called.
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;
