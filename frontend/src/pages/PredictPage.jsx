import React, { useState } from 'react';
import { Icons } from '../utils/Icons';
import { BRANDS, MODELS_MAP } from '../data';
import { apiFetch } from '../utils/api';

export default function PredictPage({ showToast, onEnlistWithPrice }) {
  const BLANK = { brand:'', model:'', vehicle_age:'', km_driven:'', mileage:'', engine:'', max_power:'', seats:'5', seller_type:'Individual', fuel:'Petrol', transmission:'Manual', owner:'First Owner' };
  const [form, setForm] = useState(BLANK);
  const [loading, setLoad] = useState(false);
  const [res, setRes] = useState(null);

  const models = MODELS_MAP[form.brand] || [];
  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value, ...(e.target.name === 'brand' ? {model:''} : {}) }));

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true); setRes(null);
    try {
      const body = {
        vehicle_age: parseFloat(form.vehicle_age), km_driven: parseFloat(form.km_driven), mileage: parseFloat(form.mileage),
        engine: parseFloat(form.engine), max_power: parseFloat(form.max_power), seats: parseFloat(form.seats),
        brand: form.brand, model: form.model, seller_type: form.seller_type, fuel: form.fuel, transmission: form.transmission, owner: form.owner,
      };
      const data = await apiFetch('/api/predictions', { method:'POST', body:JSON.stringify(body) });
      setRes(data);
      showToast('Market analysis complete.');
    } catch(e) {
      showToast('Unable to calculate a price right now.');
    }
    setLoad(false);
  };

  const INP_C = "inp-lux w-full px-4 py-3 rounded-md text-sm";
  const LBL_C = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2";

  return (
    <div className="anim-fade pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">AI Financial Valuation</h1>
          <p className="text-gray-400">Advanced Random Forest modeling trained on millions of market transactions.</p>
        </div>
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <form onSubmit={submit} className="glass-panel p-8">
              <h2 className="text-xl font-serif text-white mb-6 border-b border-gray-800 pb-4">Vehicle Parameters</h2>
              <div className="grid grid-cols-2 gap-5">
                <div><label className={LBL_C}>Brand</label><select name="brand" required value={form.brand} onChange={set} className={INP_C}><option value="">Select</option>{BRANDS.map(b=><option key={b}>{b}</option>)}</select></div>
                <div><label className={LBL_C}>Model</label><select name="model" required value={form.model} onChange={set} disabled={!form.brand} className={INP_C}><option value="">Select</option>{models.map(m=><option key={m}>{m}</option>)}</select></div>
                <div><label className={LBL_C}>Vehicle Age (Yrs)</label><input type="number" step="0.1" name="vehicle_age" required value={form.vehicle_age} onChange={set} className={INP_C} placeholder="e.g. 3.5"/></div>
                <div><label className={LBL_C}>KM Driven</label><input type="number" name="km_driven" required value={form.km_driven} onChange={set} className={INP_C} placeholder="e.g. 45000"/></div>
                <div><label className={LBL_C}>Engine (CC)</label><input type="number" name="engine" required value={form.engine} onChange={set} className={INP_C} placeholder="e.g. 1197"/></div>
                <div><label className={LBL_C}>Max Power (BHP)</label><input type="number" step="0.1" name="max_power" required value={form.max_power} onChange={set} className={INP_C} placeholder="e.g. 118.5"/></div>
                <div><label className={LBL_C}>Mileage (KM/L)</label><input type="number" step="0.1" name="mileage" required value={form.mileage} onChange={set} className={INP_C} placeholder="e.g. 18.5"/></div>
                <div><label className={LBL_C}>Fuel Type</label><select name="fuel" value={form.fuel} onChange={set} className={INP_C}><option>Petrol</option><option>Diesel</option><option>CNG</option></select></div>
                <div><label className={LBL_C}>Transmission</label><select name="transmission" value={form.transmission} onChange={set} className={INP_C}><option>Manual</option><option>Automatic</option></select></div>
                <div><label className={LBL_C}>Ownership</label><select name="owner" value={form.owner} onChange={set} className={INP_C}><option>First Owner</option><option>Second Owner</option><option>Third Owner</option></select></div>
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full mt-8 py-4 rounded-md text-sm uppercase tracking-widest">
                {loading ? 'Analyzing Market Data...' : 'Calculate Market Value'}
              </button>
            </form>
          </div>
          <div className="md:col-span-2">
            <div className="sticky top-28">
              {res ? (
                <div className="glass-panel p-8 text-center border-lux/40 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Estimated Market Value</p>
                  <div className="text-4xl font-serif font-bold text-white mb-6 text-lux">{res.formatted_price}</div>
                  <div className="border-t border-gray-800 pt-6">
                    <p className="text-xs text-gray-500 mb-4">Valuation Details</p>
                    <div className="flex justify-between items-center text-sm mb-3"><span className="text-gray-400">Lower Bound</span><span className="text-gray-300 font-medium">{res.valuation_range.lower_bound}</span></div>
                    <div className="flex justify-between items-center text-sm mb-3"><span className="text-gray-400">Upper Bound</span><span className="text-gray-300 font-medium">{res.valuation_range.upper_bound}</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Market Average</span><span className="text-lux font-medium">{res.formatted_price}</span></div>
                  </div>
                  <button onClick={() => onEnlistWithPrice(form, res.estimated_price_inr)} className="btn-outline w-full mt-8 py-3 rounded-md text-xs uppercase tracking-widest">
                    Enlist at AI Price &rarr;
                  </button>
                </div>
              ) : (
                <div className="glass-panel p-8 text-center border-dashed border-gray-700 h-full flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-gray-600 mb-4"><Icons.ChartBar /></div>
                  <p className="text-gray-400 text-sm">Input vehicle parameters to generate a real-time financial valuation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
