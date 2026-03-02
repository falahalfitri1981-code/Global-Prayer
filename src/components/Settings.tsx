import { useState, useEffect } from 'react';
import { LocationSettings, IqomahSettings } from '../hooks/usePrayerTimes';
import { X, MapPin, Clock, Settings2 } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationSettings;
  setLocation: (loc: LocationSettings) => void;
  iqomahOffsets: IqomahSettings;
  setIqomahOffsets: (offsets: IqomahSettings) => void;
  calculationMethod: string;
  setCalculationMethod: (method: string) => void;
}

export default function Settings({
  isOpen,
  onClose,
  location,
  setLocation,
  iqomahOffsets,
  setIqomahOffsets,
  calculationMethod,
  setCalculationMethod,
}: SettingsProps) {
  const [tempLocation, setTempLocation] = useState(location);
  const [tempIqomah, setTempIqomah] = useState(iqomahOffsets);
  const [tempMethod, setTempMethod] = useState(calculationMethod);

  useEffect(() => {
    if (isOpen) {
      setTempLocation(location);
      setTempIqomah(iqomahOffsets);
      setTempMethod(calculationMethod);
    }
  }, [isOpen, location, iqomahOffsets, calculationMethod]);

  const handleSave = () => {
    setLocation(tempLocation);
    setIqomahOffsets(tempIqomah);
    setCalculationMethod(tempMethod);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-emerald-600" />
            Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8">
          {/* Location Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Location
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={tempLocation.latitude}
                  onChange={(e) => setTempLocation({ ...tempLocation, latitude: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={tempLocation.longitude}
                  onChange={(e) => setTempLocation({ ...tempLocation, longitude: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">City Name (Optional)</label>
                <input
                  type="text"
                  value={tempLocation.city || ''}
                  onChange={(e) => setTempLocation({ ...tempLocation, city: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="e.g. Jakarta"
                />
              </div>
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setTempLocation({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        city: 'Current Location',
                      });
                    });
                  }
                }}
                className="col-span-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Use Current Location
              </button>
            </div>
          </section>

          {/* Calculation Method */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Calculation Method
            </h3>
            <select
              value={tempMethod}
              onChange={(e) => setTempMethod(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white"
            >
              <option value="MuslimWorldLeague">Muslim World League</option>
              <option value="Egyptian">Egyptian General Authority of Survey</option>
              <option value="Karachi">University of Islamic Sciences, Karachi</option>
              <option value="UmmAlQura">Umm Al-Qura University, Makkah</option>
              <option value="Dubai">Dubai</option>
              <option value="Qatar">Qatar</option>
              <option value="Kuwait">Kuwait</option>
              <option value="MoonsightingCommittee">Moonsighting Committee</option>
              <option value="Singapore">Singapore</option>
              <option value="Turkey">Turkey</option>
              <option value="Tehran">Tehran</option>
              <option value="NorthAmerica">ISNA (North America)</option>
            </select>
          </section>

          {/* Iqomah Offsets */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Iqomah Offsets (Minutes)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(tempIqomah).map(([prayer, offset]) => (
                <div key={prayer}>
                  <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{prayer}</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={offset}
                    onChange={(e) => setTempIqomah({ ...tempIqomah, [prayer]: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
