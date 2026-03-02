import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20">
      <div className="text-5xl sm:text-6xl md:text-8xl font-mono font-bold text-white tracking-tighter drop-shadow-lg text-center">
        {format(time, 'HH:mm:ss')}
      </div>
      <div className="text-lg sm:text-xl md:text-2xl text-white/80 mt-2 font-medium tracking-wide uppercase text-center">
        {format(time, 'EEEE, d MMMM yyyy')}
      </div>
      <div className="text-xs sm:text-sm text-white/60 mt-1 font-light tracking-widest uppercase text-center">
        {Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')}
      </div>
    </div>
  );
}
