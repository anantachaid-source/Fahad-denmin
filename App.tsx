
import React, { useState } from 'react';
import { UserRole, Booking } from './types';
import Layout from './components/Layout';
import CustomerView from './views/CustomerView';
import RestaurantView from './views/RestaurantView';
import AdminView from './views/AdminView';

const INITIAL_BOOKINGS: Booking[] = [
  { id: '1', queueNumber: 'A-038', customerName: 'คุณมะลิ', guestCount: 2, status: 'WAITING', preOrderItems: [{ id: '1', name: 'สลัดผักออร์แกนิค', price: 120, description: '', image: '', category: '', quantity: 2 }], timestamp: new Date(Date.now() - 30 * 60000), estimatedWaitMinutes: 5 },
  { id: '2', queueNumber: 'A-039', customerName: 'คุณธนา', guestCount: 4, status: 'WAITING', preOrderItems: [{ id: '2', name: 'พิซซ่าหน้าอิตาเลียน', price: 290, description: '', image: '', category: '', quantity: 1 }], timestamp: new Date(Date.now() - 25 * 60000), estimatedWaitMinutes: 10 },
  { id: '3', queueNumber: 'A-040', customerName: 'คุณสรพงษ์', guestCount: 3, status: 'WAITING', preOrderItems: [], timestamp: new Date(Date.now() - 15 * 60000), estimatedWaitMinutes: 15 },
  { id: '4', queueNumber: 'A-041', customerName: 'คุณจอย', guestCount: 2, status: 'WAITING', preOrderItems: [], timestamp: new Date(Date.now() - 5 * 60000), estimatedWaitMinutes: 20 },
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

  const renderContent = () => {
    switch (currentRole) {
      case 'RESTAURANT':
        return <RestaurantView bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />;
      case 'ADMIN':
        return <AdminView />;
      case 'CUSTOMER':
      default:
        return <CustomerView onAddBooking={handleAddBooking} currentQueue={bookings.find(b => b.status === 'CALLED')?.queueNumber || 'A-038'} />;
    }
  };

  return (
    <Layout currentRole={currentRole} onRoleChange={setCurrentRole}>
      {renderContent()}
    </Layout>
  );
};

export default App;
