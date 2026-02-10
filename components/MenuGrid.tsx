
import React from 'react';
import { Dish, CartItem } from '../types';

interface MenuGridProps {
  dishes: Dish[];
  onAddToCart: (dish: Dish) => void;
  onRemoveFromCart: (id: string) => void;
  cart: CartItem[];
}

const MenuGrid: React.FC<MenuGridProps> = ({ dishes, onAddToCart, onRemoveFromCart, cart }) => {
  const getItem = (id: string) => cart.find(item => item.id === id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {dishes.map((dish) => {
        const cartItem = getItem(dish.id);
        const quantity = cartItem?.quantity || 0;

        return (
          <div key={dish.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 uppercase tracking-tighter">
                {dish.category}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors">{dish.name}</h3>
                <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-lg text-sm">฿{dish.price}</span>
              </div>
              <p className="text-slate-400 text-xs line-clamp-2 mb-5 leading-relaxed">{dish.description}</p>
              
              <div className="mt-auto">
                {quantity > 0 ? (
                  <div className="flex items-center justify-between bg-sky-50 rounded-2xl p-1 border border-sky-100">
                    <button 
                      onClick={() => onRemoveFromCart(dish.id)}
                      className="w-10 h-10 flex items-center justify-center bg-white text-sky-600 rounded-xl shadow-sm hover:bg-sky-100 transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-sky-700 text-sm">{quantity} รายการ</span>
                    <button 
                      onClick={() => onAddToCart(dish)}
                      className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-xl shadow-sm hover:bg-sky-600 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => onAddToCart(dish)}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-sky-500 hover:text-white transition-all duration-300 border border-slate-100 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    เพิ่มลงรายการจอง
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuGrid;
