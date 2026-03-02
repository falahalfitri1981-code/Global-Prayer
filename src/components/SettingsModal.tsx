import { useState, useEffect } from 'react';
import { Settings2, X, Clock } from 'lucide-react';

export interface IqomahSettings {
  Fajr: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  iqomah: IqomahSettings;
  setIqomah: (settings: IqomahSettings) => void;
}

export default function SettingsModal({ isOpen, onClose, iqomah, setIqomah }: SettingsModalProps) {
  const [tempIqomah, setTempIqomah] = useState(iqomah);

  useEffect(() => {
    if (isOpen) {
      setTempIqomah(iqomah);
    }
  }, [isOpen, iqomah]);

  const handleSave = () => {
    setIqomah(tempIqomah);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-emerald-600 text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Pengaturan Iqomah
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-sm text-slate-500 mb-4">
            Atur jeda waktu (dalam menit) dari Adzan menuju Iqomah sesuai dengan kebiasaan masjid di wilayah Anda.
          </p>
          
          {Object.entries(tempIqomah).map(([prayer, minutes]) => (
            <div key={prayer} className="flex items-center justify-between gap-4">
              <label className="w-1/3 text-right font-semibold text-slate-700 capitalize">{prayer}</label>
              <div className="flex-1 relative">
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={minutes}
                  onChange={(e) => setTempIqomah({ ...tempIqomah, [prayer]: parseInt(e.target.value) || 0 })}
                  className="w-full pl-4 pr-12 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
                  Menit
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-slate-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-md transition-all text-sm flex items-center gap-2"
          >
            <Clock className="w-4 h-4" /> Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
