import { useState, useEffect } from 'react';
import { format, addMinutes, differenceInSeconds } from 'date-fns';
import { motion } from 'motion/react';
import { Sunrise, Sun, Sunset, Moon, CloudSun, Clock, Users } from 'lucide-react';

interface PrayerCardProps {
  name: string;
  time: string; // "HH:mm"
  iqomahOffset: number | null;
  isNext: boolean;
  isCurrent: boolean;
  timezone: string;
}

const getPrayerIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'fajr': return <Sunrise className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />;
    case 'sunrise': return <Sun className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />;
    case 'dhuhr': return <Sun className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />;
    case 'asr': return <CloudSun className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />;
    case 'maghrib': return <Sunset className="w-8 h-8 md:w-10 md:h-10 text-red-500" />;
    case 'isha': return <Moon className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" />;
    default: return <Clock className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />;
  }
};

export default function PrayerCard({ name, time, iqomahOffset, isNext, isCurrent, timezone }: PrayerCardProps) {
  const [iqomahTime, setIqomahTime] = useState<string>('');
  const [status, setStatus] = useState<'waiting' | 'iqomah' | 'praying'>('waiting');

  useEffect(() => {
    if (!iqomahOffset) return;

    const [hours, minutes] = time.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    
    // Adjust for timezone if needed, but assuming local time for now since API returns local
    const iqomahDate = addMinutes(prayerDate, iqomahOffset);
    setIqomahTime(format(iqomahDate, 'HH:mm'));

  }, [time, iqomahOffset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 border-2 ${
        isNext 
          ? 'bg-white border-emerald-500 shadow-xl scale-105 z-10 ring-4 ring-emerald-100' 
          : 'bg-white border-transparent shadow-sm hover:shadow-md hover:-translate-y-1'
      }`}
    >
      <div className={`mb-4 transition-transform duration-500 ${isNext ? 'scale-110 animate-pulse' : ''}`}>
        {getPrayerIcon(name)}
      </div>
      
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {name}
      </h3>
      
      <div className={`text-3xl md:text-4xl font-bold font-mono tracking-tight mb-2 ${isNext ? 'text-emerald-600' : 'text-slate-800'}`}>
        {time}
      </div>

      {iqomahOffset !== null ? (
        <div className="mt-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <Users className="w-3 h-3" />
          Iqomah {iqomahTime}
        </div>
      ) : (
        <div className="mt-2 px-3 py-1 opacity-0 select-none text-xs">
          ---
        </div>
      )}
    </motion.div>
  );
}
