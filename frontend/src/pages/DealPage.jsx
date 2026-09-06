import React, { useState } from 'react';
import { Icons } from '../utils/Icons';
import { fmtPrice } from '../utils/helpers';

export default function DealPage({ car, setPage, showToast }) {
  const [sent, setSent] = useState(false);
  
  const handleEmail = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => window.location.href = `mailto:${car.seller.toLowerCase().replace(/\s+/g,'')}@autoxp.com?subject=Inquiry: ${car.brand} ${car.model}`, 500);
    setTimeout(() => setSent(false), 3000);
  };

  if(!car) return null;
  return (
    <div className="anim-fade pt-20 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => setPage('buy')} className="text-gray-400 hover:text-lux text-sm flex items-center gap-2 mb-8 transition-colors">
          &larr; Back to Listings
        </button>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img src={car.img} alt={car.brand} className="w-full h-full object-cover min-h-[400px]" />
          </div>
          
          <div>
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{car.brand} <span className="text-lux">{car.model}</span></h1>
              <p className="text-gray-400">{car.year} &middot; {car.city}</p>
            </div>

            <div className="text-5xl font-sans font-bold text-white mb-10 pb-10 border-b border-gray-900">
              {fmtPrice(car.price)}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4"><div className="text-lux mt-1"><Icons.Fuel/></div><div><p className="text-xs text-gray-500 uppercase tracking-widest">Fuel Type</p><p className="text-white font-medium">{car.fuel}</p></div></div>
              <div className="flex items-start gap-4"><div className="text-lux mt-1"><Icons.Transmission/></div><div><p className="text-xs text-gray-500 uppercase tracking-widest">Transmission</p><p className="text-white font-medium">{car.trans}</p></div></div>
              <div className="flex items-start gap-4"><div className="text-lux mt-1"><Icons.Road/></div><div><p className="text-xs text-gray-500 uppercase tracking-widest">KM Driven</p><p className="text-white font-medium">{car.km.toLocaleString()}</p></div></div>
              <div className="flex items-start gap-4"><div className="text-lux mt-1"><Icons.User/></div><div><p className="text-xs text-gray-500 uppercase tracking-widest">Ownership</p><p className="text-white font-medium">{car.owner}</p></div></div>
            </div>

            <div className="glass-panel p-6 border-lux/20">
              <h3 className="font-serif text-xl text-white mb-4">Contact Seller</h3>
              <p className="text-gray-400 text-sm mb-6">Connect directly with {car.seller} to schedule a viewing or request more information.</p>
              <button onClick={handleEmail} className={`w-full py-4 rounded-md text-sm uppercase tracking-widest transition-all ${sent ? 'bg-green-500 text-black firework-anim font-bold' : 'btn-gold'}`}>
                {sent ? <span className="flex items-center justify-center gap-2"><Icons.Check/> Sent!</span> : <span className="flex items-center justify-center gap-2"><Icons.Mail /> Email Seller</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
