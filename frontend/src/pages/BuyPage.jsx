import React, { useState } from 'react';
import { Icons } from '../utils/Icons';
import { fmtPrice } from '../utils/helpers';
import CarCard from '../components/CarCard';

export default function BuyPage({ listings, saved, setSaved, onView, showToast }) {
  const [q, setQ] = useState('');
  const [fuel, setFuel] = useState('All');
  const [maxP, setMaxP] = useState(5000000);

  const toggleSave = (id) => {
    setSaved(p => {
      const has = p.includes(id);
      showToast(has ? 'Removed from saved' : 'Added to saved!');
      return has ? p.filter(x => x !== id) : [...p, id];
    });
  };

  const list = listings.filter(c => 
    (c.brand.toLowerCase().includes(q.toLowerCase()) || c.model.toLowerCase().includes(q.toLowerCase())) &&
    (fuel === 'All' || c.fuel === fuel) &&
    c.price <= maxP
  );

  return (
    <div className="anim-fade pt-20">
      <div className="ticker-wrap py-2 flex items-center">
        <div className="ticker-scroll">
          {[...listings, ...listings].map((c, i) => (
            <span key={i} className="text-xs font-medium text-gray-400 mx-6 tracking-wide">
              <span className="text-lux">{c.brand} {c.model}</span> ~ {fmtPrice(c.price)}, {c.city}
            </span>
          ))}
        </div>
      </div>

      <div className="relative py-20 bg-grid-lux border-b border-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight">Buy Your Dream Car</h1>
          <p className="text-lg text-gray-400 font-light mb-2">{listings.length} AI-verified luxury & premium listings across India</p>
          <p className="text-xs text-lux uppercase tracking-[0.2em]">All prices include AI valuation check</p>
        </div>
      </div>

      <div className="border-b border-gray-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center gap-10 flex-wrap opacity-60">
          {['MARUTI','HYUNDAI','HONDA','TATA','BMW','MERCEDES'].map(b => <span key={b} className="text-xl font-bold font-serif text-white">{b}</span>)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="glass-panel p-6 mb-12">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <div className="absolute left-4 top-3.5 text-gray-500"><Icons.Search /></div>
              <input type="text" placeholder="Search brand, model, city..." value={q} onChange={e=>setQ(e.target.value)} className="inp-lux w-full pl-12 pr-4 py-3 rounded-md text-sm" />
            </div>
            <select value={fuel} onChange={e=>setFuel(e.target.value)} className="inp-lux px-4 py-3 rounded-md text-sm">
              <option value="All">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
            <div className="flex flex-col justify-center px-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium tracking-wide">
                <span>Max Price</span><span className="text-lux">{fmtPrice(maxP)}</span>
              </div>
              <input type="range" min="100000" max="5000000" step="50000" value={maxP} onChange={e=>setMaxP(+e.target.value)} className="w-full" />
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center mb-6">Why AutoXP AI Marketplace?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Icons.Shield />, title: 'AI-Verified Listings', desc: 'Every car dynamically checked against 20+ condition parameters.' },
              { icon: <Icons.ChartBar />, title: 'Transparent Pricing', desc: 'Real-time market valuation ensures you pay exactly what it is worth.' },
              { icon: <Icons.Handshake />, title: 'Trusted Transactions', desc: 'Seamless, secure process directly connecting verified buyers and sellers.' }
            ].map((f,i) => (
              <div key={i} className="border border-lux/30 bg-[#0F0F0F] rounded-lg p-6 text-center hover:border-lux/60 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lux/10 text-lux mb-4">{f.icon}</div>
                <h3 className="text-white font-serif font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 border-b border-gray-900 pb-4">
          <h2 className="text-2xl font-serif text-white">Premium Vehicles</h2>
          <span className="text-sm text-gray-400">{list.length} matches</span>
        </div>

        {list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map(c => <CarCard key={c.id} car={c} saved={saved.includes(c.id)} onSave={toggleSave} onView={onView} />)}
          </div>
        ) : <div className="text-center py-20"><p className="text-gray-500 text-lg">No vehicles match your refined criteria.</p></div>}
      </div>
    </div>
  );
}
