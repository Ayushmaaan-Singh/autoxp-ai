import React from 'react';
import { Icons } from '../utils/Icons';
import { fmtPrice } from '../utils/helpers';

export default function CarCard({ car, saved, onSave, onView }) {
  return (
    <div className="glass-panel flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] gold-border-hover border border-gray-800">
      <div className="relative h-48 overflow-hidden cursor-pointer group" onClick={() => onView(car)}>
        <img src={car.img} alt={car.brand} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        {car.badge && (
          <div className="absolute top-3 left-3 bg-white text-black px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider shadow-lg">
            {car.badge}
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); onSave(car.id); }} className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur hover:bg-black/80 text-white transition-colors border border-white/10">
          <Icons.Heart solid={saved} />
        </button>
      </div>
      <div className="p-5 pt-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-1 leading-tight">{car.brand} <span className="text-gray-300 font-medium">{car.model}</span></h3>
        <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">{car.year} • {car.city}</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-300"><span className="text-lux"><Icons.Fuel /></span> {car.fuel}</div>
          <div className="flex items-center gap-2 text-sm text-gray-300"><span className="text-lux"><Icons.Transmission /></span> {car.trans}</div>
          <div className="flex items-center gap-2 text-sm text-gray-300"><span className="text-lux"><Icons.Road /></span> {Math.round(car.km/1000)}k km</div>
          <div className="flex items-center gap-2 text-sm text-gray-300"><span className="text-lux"><Icons.User /></span> {car.owner}</div>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
          <span className="text-lg font-bold text-lux font-sans">{fmtPrice(car.price)}</span>
          <button onClick={() => onView(car)} className="btn-gold w-full max-w-[140px] py-2 rounded-sm text-xs tracking-widest uppercase">
            View Deal &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
