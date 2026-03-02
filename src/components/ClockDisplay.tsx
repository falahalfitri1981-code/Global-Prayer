import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function ClockDisplay({ timezone }: { timezone: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // Create date object adjusted for timezone if needed
      // For now, assuming browser timezone matches or using simple new Date()
      // Ideally, use date-fns-tz for specific timezone support
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [timezone]);

  return (
    <div className="text-center mb-8 md:mb-12">
      <div className="text-5xl md:text-7xl font-bold text-emerald-600 font-mono tracking-tighter tabular-nums leading-none mb-2 drop-shadow-sm">
        {format(time, 'HH:mm:ss')}
      </div>
      <h2 className="text-lg md:text-xl font-bold text-slate-700 mb-1">
        {format(time, 'EEEE, d MMMM yyyy')}
      </h2>
      <p className="text-sm md:text-base text-slate-500 font-medium">
        {/* Hijri date would be passed from API data ideally */}
        {Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')}
      </p>
    </div>
  );
}
