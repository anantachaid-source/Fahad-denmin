
import React, { useState, useEffect } from 'react';
import { UserRole, Booking } from './types';
import Layout from './components/Layout';
import CustomerView from './views/CustomerView';
import RestaurantView from './views/RestaurantView';
import AdminView from './views/AdminView';

const INITIAL_BOOKINGS: Booking[] = [
  { id: '1', queueNumber: 'A-038', customerName: 'คุณมะลิ', guestCount: 2, status: 'WAITING', preOrderItems: [{ id: '1', name: 'สลัดผักออร์แกนิค', price: 120, description: '', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80', category: '', quantity: 2 }], timestamp: new Date(Date.now() - 30 * 60000), estimatedWaitMinutes: 5 },
  { id: '2', queueNumber: 'A-039', customerName: 'คุณธนา', guestCount: 4, status: 'WAITING', preOrderItems: [{ id: '2', name: 'พิซซ่าเตาถ่านหน้าอิตาเลียน', price: 290, description: '', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&q=80', category: '', quantity: 1 }], timestamp: new Date(Date.now() - 25 * 60000), estimatedWaitMinutes: 10 },
];

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const handleAddBooking = (newBooking: Booking) => {
    setBookings(prev => [...prev, newBooking]);
  };

  const handleUpdateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  // คำนวณคิวปัจจุบันจากคิวที่สถานะเป็น CALLED ล่าสุด หรือ Waiting คิวแรกสุด
  const calledQueue = bookings.filter(b => b.status === 'CALLED').pop()?.queueNumber;
  const currentQueueDisplay = calledQueue || 'A-038';

  const renderContent = () => {
    switch (currentRole) {
      case 'RESTAURANT':
        return <RestaurantView bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />;
      case 'ADMIN':
        return <AdminView />;
      case 'CUSTOMER':
      default:
        return <CustomerView onAddBooking={handleAddBooking} currentQueue={currentQueueDisplay} />;
    }
  };

  return (
    <Layout currentRole={currentRole} onRoleChange={setCurrentRole}>
      {renderContent()}
    </Layout>
  );
};

export default App;
