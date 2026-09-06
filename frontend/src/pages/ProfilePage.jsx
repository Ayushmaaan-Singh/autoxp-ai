import React, { useState } from 'react';
import CarCard from '../components/CarCard';
import { updateUserProfile } from '../utils/auth';

export default function ProfilePage({ saved, onView, listings, user, setUser, onEditListing }) {
  const [tab, setTab] = useState('saved');
  const [edit, setEdit] = useState(false);
  const [uForm, setUForm] = useState(user || {});
  const [saving, setSaving] = useState(false);

  // The API uses `displayName`; support legacy `name` field too
  const displayName = user?.displayName || user?.name || '?';

  const savedData = listings.filter(c => saved.includes(c.id));
  // Active listings: owned by this user (seller_id match or seller name match)
  const activeData = listings.filter(c =>
    (user?.id && c.seller_id === user.id) ||
    c.seller === displayName
  );

  const saveProfile = async () => {
    setSaving(true);
    try {
      const updates = {
        displayName: uForm.displayName || uForm.name,
        location: uForm.location,
        phone: uForm.phone,
      };
      const updated = await updateUserProfile(updates);
      setUser(u => ({ ...u, ...updated }));
      setEdit(false);
    } catch {
      // silently keep edit open — could add toast here
    } finally {
      setSaving(false);
    }
  };

  const INP_C = "inp-lux w-full px-3 py-2 rounded-md text-sm mb-3";

  return (
    <div className="anim-fade pt-20">
      <div className="bg-[#0A0A0A] border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-lux flex items-center justify-center text-3xl font-serif font-bold text-black flex-shrink-0">
                {displayName.charAt(0)}
              </div>
              {edit ? (
                <div className="w-64">
                  <input value={uForm.displayName || uForm.name || ''} onChange={e => setUForm({ ...uForm, displayName: e.target.value, name: e.target.value })} className={INP_C} placeholder="Name" />
                  <input value={uForm.email || ''} disabled className={INP_C + " opacity-50 cursor-not-allowed"} placeholder="Email" title="Email cannot be changed" />
                  <input value={uForm.phone || ''} onChange={e => setUForm({ ...uForm, phone: e.target.value })} className={INP_C} placeholder="Phone" />
                  <input value={uForm.location || ''} onChange={e => setUForm({ ...uForm, location: e.target.value })} className={INP_C} placeholder="Location" />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-serif font-bold text-white">{displayName}</h1>
                  <p className="text-gray-400 text-sm mt-1">{user?.email} &middot; {user?.phone || '—'}</p>
                  <p className="text-gray-400 text-sm mt-1">{user?.location || 'No location set'}</p>
                </div>
              )}
            </div>
            <button
              onClick={edit ? saveProfile : () => setEdit(true)}
              disabled={saving}
              className="btn-outline px-4 py-2 rounded-md text-xs uppercase tracking-widest"
            >
              {saving ? 'Saving…' : edit ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
          <div className="mt-8 flex gap-6">
            <button onClick={() => setTab('saved')} className={`pb-2 text-sm uppercase tracking-widest ${tab === 'saved' ? 'text-lux border-b border-lux' : 'text-gray-500'}`}>Saved ({savedData.length})</button>
            <button onClick={() => setTab('active')} className={`pb-2 text-sm uppercase tracking-widest ${tab === 'active' ? 'text-lux border-b border-lux' : 'text-gray-500'}`}>Active Listings ({activeData.length})</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {tab === 'saved' && (
          savedData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedData.map(c => <CarCard key={c.id} car={c} saved={true} onSave={() => {}} onView={onView} />)}
            </div>
          ) : <p className="text-gray-500">You have no saved vehicles in your collection.</p>
        )}
        {tab === 'active' && (
          activeData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeData.map(c => (
                <div key={c.id} className="relative group">
                  <CarCard car={c} saved={saved.includes(c.id)} onSave={() => {}} onView={onView} />
                  <button onClick={() => onEditListing(c)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 btn-gold px-6 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-10 text-xs">
                    Edit Listing
                  </button>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">You have no active listings.</p>
        )}
      </div>
    </div>
  );
}
