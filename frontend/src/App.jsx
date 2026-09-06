import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BuyPage from './pages/BuyPage';
import PredictPage from './pages/PredictPage';
import EnlistPage from './pages/EnlistPage';
import ProfilePage from './pages/ProfilePage';
import DealPage from './pages/DealPage';
import LoginPage from './pages/LoginPage';
import { Icons } from './utils/Icons';
import { fetchCurrentUser, logout as authLogout } from './utils/auth';
import { fetchListings } from './utils/listings';

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState('buy');
  const [saved, setSaved] = useState([]);
  const [toast, setToast] = useState('');
  const [selCar, setSelCar] = useState(null);
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [enlistData, setEnlistData] = useState(null);

  // ── Restore session from stored JWT on mount ──────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const u = await fetchCurrentUser();
        if (u) {
          setUser(u);
          setAuthed(true);
        }
      } catch {
        /* token expired or invalid — stay logged out */
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  // ── Load listings from MongoDB ────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchListings();
        setListings(data || []);
      } catch {
        setListings([]);
      } finally {
        setListingsLoading(false);
      }
    })();
  }, []);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  const viewCar = (c) => { setSelCar(c); setPage('deal'); window.scrollTo(0, 0); };

  const handleEnlistWithPrice = (form, price) => {
    setEnlistData({
      brand: form.brand, model: form.model,
      year: Math.round(new Date().getFullYear() - (form.vehicle_age || 0)),
      fuel: form.fuel, trans: form.transmission,
      km: Math.round(+form.km_driven), city: user?.location || '',
      price: Math.round(price),
    });
    setPage('enlist');
    window.scrollTo(0, 0);
  };

  const handleEditListing = (car) => {
    setEnlistData(car);
    setPage('enlist');
    window.scrollTo(0, 0);
  };

  /** Called by EnlistPage after a successful API save. */
  const addListing = (c) => {
    if (c.id && listings.find(x => x.id === c.id)) {
      setListings(p => p.map(x => x.id === c.id ? c : x));
    } else {
      setListings(p => [c, ...p]);
    }
    setEnlistData(null);
  };

  const handleLogin = (userData) => {
    setUser(u => ({ ...u, ...userData }));
    setAuthed(true);
    setPage('buy');
  };

  const handleLogout = () => {
    authLogout();
    setAuthed(false);
    setUser(null);
    setPage('buy');
  };

  const PAGES = {
    buy: <BuyPage listings={listings} listingsLoading={listingsLoading} saved={saved} setSaved={setSaved} onView={viewCar} showToast={showToast} />,
    predict: <PredictPage showToast={showToast} onEnlistWithPrice={handleEnlistWithPrice} />,
    enlist: <EnlistPage showToast={showToast} setPage={setPage} addListing={addListing} initData={enlistData} />,
    profile: <ProfilePage saved={saved} onView={viewCar} listings={listings} user={user} setUser={setUser} onEditListing={handleEditListing} />,
    deal: <DealPage car={selCar} setPage={setPage} showToast={showToast} />,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-2 border-lux/30 border-t-lux rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authed) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar page={page} setPage={setPage} onLogout={handleLogout} />
      <main className="flex-1">{PAGES[page]}</main>

      {toast && (
        <div className="toast-w">
          <div className="glass-panel bg-black/90 px-6 py-4 flex items-center gap-3 border-lux/50">
            <span className="text-lux"><Icons.Check /></span>
            <p className="text-sm font-medium text-white">{toast}</p>
          </div>
        </div>
      )}

      <footer className="border-t border-gray-900 bg-[#050505] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="font-serif text-2xl font-bold text-white mb-4">AUTO<span className="text-lux">XP</span></div>
          <p className="text-gray-500 text-sm tracking-widest uppercase mb-8">Premium AI Car Marketplace</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
