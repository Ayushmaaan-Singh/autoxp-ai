import React, { useState } from 'react';
import { Icons } from '../utils/Icons';
import { apiFetch } from '../utils/api';
import { createListing, updateListing } from '../utils/listings';

export default function EnlistPage({ showToast, setPage, addListing, initData }) {
  const [form, setForm] = useState(initData || {
    brand: '', model: '', year: '', fuel: 'Petrol',
    trans: 'Manual', km: '', city: '', price: '', img: '',
  });
  const [predicting, setPredicting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, img: ev.target.result });
    reader.readAsDataURL(file);
  };

  const predictPrice = async () => {
    if (!form.brand || !form.model || !form.year || !form.km) {
      showToast('Please fill Brand, Model, Year, and KM first.'); return;
    }
    setPredicting(true);
    try {
      const body = {
        vehicle_age: new Date().getFullYear() - +form.year, km_driven: +form.km, mileage: 18.5,
        engine: 1200, max_power: 100, seats: 5,
        brand: form.brand, model: form.model, seller_type: 'Individual',
        fuel: form.fuel, transmission: form.trans, owner: 'First Owner',
      };
      const data = await apiFetch('/api/predictions', { method: 'POST', body: JSON.stringify(body) });
      setForm({ ...form, price: Math.round(data.estimated_price_inr) });
      showToast('AI Valuation applied!');
    } catch {
      showToast('Failed to predict price.');
    }
    setPredicting(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      brand: form.brand, model: form.model, year: Math.round(+form.year),
      km: Math.round(+form.km), fuel: form.fuel, trans: form.trans,
      engine: '1200cc', power: '100 bhp', seats: 5,
      owner: '1st Owner', price: +form.price, city: form.city,
      badge: initData?.id ? 'Updated' : 'New Arrival',
      img: form.img || null,
    };

    try {
      let savedCar;
      if (initData?.id) {
        savedCar = await updateListing(initData.id, payload);
        showToast('Listing updated successfully!');
      } else {
        savedCar = await createListing(payload);
        showToast('Listing created successfully!');
      }
      addListing(savedCar);
      setPage('profile');
    } catch (err) {
      showToast(err.message || 'Failed to save listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const INP_C = "inp-lux w-full px-4 py-3 rounded-md text-sm";
  const LBL_C = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2";

  return (
    <div className="anim-fade pt-20">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-serif font-bold text-white mb-8 text-center">
          {initData?.id ? 'Edit Your Listing' : 'Enlist Your Car'}
        </h1>
        <form onSubmit={submit} className="glass-panel p-8">
          {form.img && <img src={form.img} alt="Preview" className="w-full h-48 object-cover rounded-md mb-6 border border-gray-800" />}
          <div className="grid grid-cols-2 gap-5">
            <div><label className={LBL_C}>Brand</label><input required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className={INP_C} /></div>
            <div><label className={LBL_C}>Model</label><input required value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className={INP_C} /></div>
            <div><label className={LBL_C}>Year</label><input type="number" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className={INP_C} /></div>
            <div><label className={LBL_C}>KM Driven</label><input type="number" required value={form.km} onChange={e => setForm({ ...form, km: e.target.value })} className={INP_C} /></div>
            <div>
              <label className={LBL_C}>Fuel Type</label>
              <select value={form.fuel} onChange={e => setForm({ ...form, fuel: e.target.value })} className={INP_C}>
                <option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option>
              </select>
            </div>
            <div>
              <label className={LBL_C}>Transmission</label>
              <select value={form.trans} onChange={e => setForm({ ...form, trans: e.target.value })} className={INP_C}>
                <option>Manual</option><option>Automatic</option>
              </select>
            </div>
            <div><label className={LBL_C}>City</label><input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={INP_C} /></div>
            <div>
              <label className={LBL_C}>Your Price (₹)</label>
              <div className="flex gap-2">
                <input type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={INP_C} />
                <button type="button" onClick={predictPrice} disabled={predicting} className="btn-outline px-3 rounded-md text-xs whitespace-nowrap" title="Auto-fill with AI">
                  {predicting ? '...' : 'AI Price'}
                </button>
              </div>
            </div>
            <div className="col-span-2">
              <label className={LBL_C}>Car Image</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="btn-outline w-full py-3 rounded-md text-sm text-center flex items-center justify-center gap-2">
                  <Icons.Search /> {form.img ? 'Change Image' : 'Upload Image'}
                </div>
              </div>
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-gold w-full mt-8 py-4 rounded-md text-sm uppercase tracking-widest">
            {submitting ? 'Saving…' : initData?.id ? 'Save Changes' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
