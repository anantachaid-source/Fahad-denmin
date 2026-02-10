
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOCK_STATS = [
  { name: 'จันทร์', value: 45, revenue: 12000 },
  { name: 'อังคาร', value: 52, revenue: 15400 },
  { name: 'พุธ', value: 38, revenue: 11200 },
  { name: 'พฤหัส', value: 65, revenue: 19800 },
  { name: 'ศุกร์', value: 89, revenue: 26000 },
  { name: 'เสาร์', value: 120, revenue: 42000 },
  { name: 'อาทิตย์', value: 110, revenue: 38500 },
];

const AdminView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Business Intelligence</h2>
          <p className="text-slate-400 font-medium">ติดตามผลประกอบการและวิเคราะห์พฤติกรรมลูกค้า</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-slate-100 px-6 py-3 rounded-2xl font-bold text-xs text-slate-500 shadow-sm hover:bg-slate-50 transition-all">ดาวน์โหลดรายงาน</button>
            <button className="bg-sky-500 px-6 py-3 rounded-2xl font-bold text-xs text-white shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all">สรุปยอดประจำวัน</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'ยอดจองสะสม', value: '1,284', change: '+12.5%', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { label: 'รายได้จากพรีออเดอร์', value: '฿124.5k', change: '+24.1%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'เวลารอเฉลี่ย', value: '18 min', change: '-4 min', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'ความพึงพอใจ', value: '4.9/5', change: '+0.2', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative group hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path></svg>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h4>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black text-slate-800 text-lg">สถิติการใช้บริการรายวัน</h3>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl flex gap-2">
                <button className="text-[10px] font-black text-sky-500 bg-white px-3 py-1 rounded-lg shadow-sm">สัปดาห์</button>
                <button className="text-[10px] font-black text-slate-400 px-3 py-1">เดือน</button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_STATS}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} 
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 text-lg mb-10">การเติบโตของรายได้ (Pre-order)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[10, 10, 10, 10]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
           <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
             <div>
                <h3 className="font-black text-slate-800">สถานะพาร์ทเนอร์ร้านอาหาร</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Performance tracking</p>
             </div>
             <button className="text-xs font-black text-sky-500 border-2 border-sky-100 px-6 py-2 rounded-2xl hover:bg-sky-50 transition-all">จัดการร้านค้าทั้งหมด</button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <th className="px-10 py-6">ร้านอาหาร</th>
                   <th className="px-10 py-6">ยอดจองรวม</th>
                   <th className="px-10 py-6">สถานะ</th>
                   <th className="px-10 py-6">ประสิทธิภาพ</th>
                   <th className="px-10 py-6"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm">
                 {[
                   { id: 'RS-001', name: 'TastyTable Main', bookings: 428, status: 'Online', perf: 98, color: 'sky' },
                   { id: 'RS-002', name: 'Little Italy', bookings: 215, status: 'Online', perf: 92, color: 'sky' },
                   { id: 'RS-003', name: 'Burger Lab', bookings: 124, status: 'Maintenance', perf: 78, color: 'orange' },
                   { id: 'RS-004', name: 'Green Garden', bookings: 541, status: 'Online', perf: 95, color: 'sky' },
                 ].map((row, i) => (
                   <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300">
                     <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-${row.color}-500 rounded-xl flex items-center justify-center text-white font-black text-xs`}>{row.name[0]}</div>
                            <div>
                                <p className="font-black text-slate-800">{row.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{row.id}</p>
                            </div>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <p className="font-black text-slate-700">{row.bookings}</p>
                        <p className="text-[10px] text-green-500 font-bold">+12 วันนี้</p>
                     </td>
                     <td className="px-10 py-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${row.status === 'Online' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                         {row.status}
                       </span>
                     </td>
                     <td className="px-10 py-6">
                        <div className="w-32">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>Health Score</span>
                                <span>{row.perf}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-sky-500 h-full" style={{ width: `${row.perf}%` }}></div>
                            </div>
                        </div>
                     </td>
                     <td className="px-10 py-6 text-right">
                        <button className="text-slate-300 hover:text-slate-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
