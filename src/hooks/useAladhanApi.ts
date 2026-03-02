import { useState, useEffect, useCallback } from 'react';

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface PrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string; ar: string };
      month: { number: number; en: string; ar: string };
      year: string;
    };
    gregorian: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string };
      month: { number: number; en: string };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
      params: { Fajr: number; Isha: number };
    };
    latitudeAdjustmentMethod: string;
    midnightMode: string;
    school: string;
    offset: any;
  };
}

export interface ApiParams {
  city: string;
  country: string;
  method: number;
  school: number; // 0 for Shafi, 1 for Hanafi
}

export function useAladhanApi() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [params, setParams] = useState<ApiParams>(() => {
    const saved = localStorage.getItem('aladhan_params');
    return saved ? JSON.parse(saved) : {
      city: 'Jakarta',
      country: 'Indonesia',
      method: 20, // Kemenag
      school: 0, // Shafi
    };
  });

  useEffect(() => {
    localStorage.setItem('aladhan_params', JSON.stringify(params));
  }, [params]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        city: params.city,
        country: params.country,
        method: params.method.toString(),
        school: params.school.toString(),
      });

      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?${query.toString()}`);
      const json = await response.json();

      if (json.code === 200 && json.data) {
        setData(json.data);
      } else {
        setError(json.status || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error or invalid location');
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Debounce fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 800);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
        );
        const geo = await res.json();
        
        setParams(prev => ({
          ...prev,
          city: geo.city || geo.locality || prev.city,
          country: geo.countryName || prev.country,
          method: geo.countryCode === 'ID' ? 20 : prev.method // Auto-switch to Kemenag for ID
        }));
      } catch (err) {
        setError('Failed to detect location name');
      } finally {
        setLoading(false);
      }
    }, (err) => {
      setError('Geolocation permission denied');
      setLoading(false);
    });
  };

  return { data, loading, error, params, setParams, detectLocation };
}
