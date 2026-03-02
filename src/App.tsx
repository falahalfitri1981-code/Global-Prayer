import { useState, useEffect } from 'react';
import { Globe, MapPin, Building2, Calculator, Clock, Settings, Loader2 } from 'lucide-react';
import ClockDisplay from './components/ClockDisplay';
import PrayerCard from './components/PrayerCard';
import SettingsModal, { IqomahSettings } from './components/SettingsModal';
import { useAladhanApi } from './hooks/useAladhanApi';

const DEFAULT_IQOMAH: IqomahSettings = {
  Fajr: 20,
  Dhuhr: 15,
  Asr: 15,
  Maghrib: 10,
  Isha: 15,
};

export default function App() {
  const { data, loading, error, params, setParams, detectLocation } = useAladhanApi();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [iqomah, setIqomah] = useState<IqomahSettings>(() => {
    const saved = localStorage.getItem('userIqomahSettings');
    return saved ? JSON.parse(saved) : DEFAULT_IQOMAH;
  });

  useEffect(() => {
    localStorage.setItem('userIqomahSettings', JSON.stringify(iqomah));
  }, [iqomah]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, city: e.target.value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, country: e.target.value });
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams({ ...params, method: parseInt(e.target.value) });
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams({ ...params, school: parseInt(e.target.value) });
  };

  // Determine next prayer logic would go here
  // For simplicity, just passing static props for now or calculating based on data
  const getNextPrayer = () => {
    if (!data) return null;
    const now = new Date();
    const timings = data.timings;
    // Simple comparison logic (needs proper date parsing)
    // ...
    return 'Fajr'; // Placeholder
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Header */}
      <header className="bg-emerald-600 text-white py-6 shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3 tracking-tight">
            <Globe className="w-6 h-6 md:w-8 md:h-8" />
            Global Prayer Times
          </h1>
          <p className="text-emerald-100 text-sm mt-1 opacity-90 font-medium">
            Accurate prayer times & Iqomah countdowns
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12 max-w-6xl">
        
        {/* Controls Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 max-w-4xl mx-auto transform transition-all hover:shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            
            {/* Location Inputs */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex gap-2">
                <button 
                  onClick={detectLocation}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm flex-shrink-0"
                  title="Use Current Location"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                </button>
                <div className="relative flex-grow">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={params.city}
                    onChange={handleCityChange}
                    placeholder="City"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="relative w-full">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={params.country}
                  onChange={handleCountryChange}
                  placeholder="Country"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Method & School Inputs */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={params.method}
                  onChange={handleMethodChange}
                  className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm font-medium appearance-none bg-white truncate"
                >
                  <option value="2">ISNA (North America)</option>
                  <option value="3">MWL (Global)</option>
                  <option value="4">Umm Al-Qura (Makkah)</option>
                  <option value="1">Karachi</option>
                  <option value="11">MUIS (Singapore)</option>
                  <option value="13">Diyanet (Turkey)</option>
                  <option value="20">Kemenag (Indonesia)</option>
                  <option value="5">Egyptian General Authority</option>
                </select>
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={params.school}
                  onChange={handleSchoolChange}
                  className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm font-medium appearance-none bg-white"
                >
                  <option value="0">Standard (Shafi'i/Maliki/Hanbali)</option>
                  <option value="1">Hanafi</option>
                </select>
              </div>
            </div>

            {/* Settings Button */}
            <div className="lg:col-span-2 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full lg:w-auto p-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
                title="Iqomah Settings"
              >
                <Settings className="w-5 h-5" />
                <span className="lg:hidden">Settings</span>
              </button>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="mt-4 text-center">
            {loading && (
              <span className="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" /> Fetching prayer times...
              </span>
            )}
            {error && (
              <span className="inline-flex items-center gap-2 text-sm text-red-500 font-medium">
                Error: {error}
              </span>
            )}
            {!loading && !error && data && (
              <span className="inline-flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                Data Source: {data.meta.method.name}
              </span>
            )}
          </div>
        </div>

        {/* Clock Display */}
        <ClockDisplay timezone={data?.meta.timezone || 'UTC'} />
        
        {/* Hijri Date */}
        {data && (
          <div className="text-center mb-8 -mt-6">
            <p className="text-emerald-600 font-medium bg-emerald-50 inline-block px-4 py-1 rounded-full text-sm border border-emerald-100">
              {data.date.hijri.day} {data.date.hijri.month.en} {data.date.hijri.year} AH
            </p>
          </div>
        )}

        {/* Prayer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {data ? (
            <>
              <PrayerCard 
                name="Fajr" 
                time={data.timings.Fajr} 
                iqomahOffset={iqomah.Fajr} 
                isNext={false} 
                isCurrent={false} 
                timezone={data.meta.timezone} 
              />
              <PrayerCard 
                name="Sunrise" 
                time={data.timings.Sunrise} 
                iqomahOffset={null} 
                isNext={false} 
                isCurrent={false} 
                timezone={data.meta.timezone} 
              />
              <PrayerCard 
                name="Dhuhr" 
                time={data.timings.Dhuhr} 
                iqomahOffset={iqomah.Dhuhr} 
                isNext={false} 
                isCurrent={false} 
                timezone={data.meta.timezone} 
              />
              <PrayerCard 
                name="Asr" 
                time={data.timings.Asr} 
                iqomahOffset={iqomah.Asr} 
                isNext={false} 
                isCurrent={false} 
                timezone={data.meta.timezone} 
              />
              <PrayerCard 
                name="Maghrib" 
                time={data.timings.Maghrib} 
                iqomahOffset={iqomah.Maghrib} 
                isNext={false} 
                isCurrent={false} 
                timezone={data.meta.timezone} 
              />
              <PrayerCard 
                name="Isha" 
                time={data.timings.Isha} 
                iqomahOffset={iqomah.Isha} 
                isNext={false} 
                isCurrent={false} 
                timezone={data.meta.timezone} 
              />
            </>
          ) : (
            // Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-48 animate-pulse border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-16 mx-auto mb-3"></div>
                <div className="h-8 bg-slate-200 rounded w-24 mx-auto mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-20 mx-auto"></div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        iqomah={iqomah} 
        setIqomah={setIqomah} 
      />
    </div>
  );
}
