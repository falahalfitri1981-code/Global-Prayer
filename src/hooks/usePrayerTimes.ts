import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export interface LocationSettings {
  latitude: number;
  longitude: number;
  city?: string; // Optional city name for display
}

export interface IqomahSettings {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

const DEFAULT_LOCATION: LocationSettings = {
  latitude: -6.2088, // Jakarta
  longitude: 106.8456,
  city: 'Jakarta',
};

const DEFAULT_IQOMAH: IqomahSettings = {
  fajr: 10,
  dhuhr: 10,
  asr: 10,
  maghrib: 5,
  isha: 10,
};

export function usePrayerTimes() {
  const [location, setLocation] = useState<LocationSettings>(() => {
    const saved = localStorage.getItem('prayer_location');
    return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
  });

  const [iqomahOffsets, setIqomahOffsets] = useState<IqomahSettings>(() => {
    const saved = localStorage.getItem('prayer_iqomah');
    return saved ? JSON.parse(saved) : DEFAULT_IQOMAH;
  });

  const [calculationMethod, setCalculationMethod] = useState<string>(() => {
    return localStorage.getItem('prayer_method') || 'MuslimWorldLeague';
  });

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('prayer_location', JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem('prayer_iqomah', JSON.stringify(iqomahOffsets));
  }, [iqomahOffsets]);

  useEffect(() => {
    localStorage.setItem('prayer_method', calculationMethod);
  }, [calculationMethod]);

  useEffect(() => {
    if (!location) return;

    const coordinates = new Coordinates(location.latitude, location.longitude);
    const date = new Date();
    
    // Select calculation method
    let params = CalculationMethod.MuslimWorldLeague();
    switch (calculationMethod) {
      case 'MuslimWorldLeague': params = CalculationMethod.MuslimWorldLeague(); break;
      case 'Egyptian': params = CalculationMethod.Egyptian(); break;
      case 'Karachi': params = CalculationMethod.Karachi(); break;
      case 'UmmAlQura': params = CalculationMethod.UmmAlQura(); break;
      case 'Dubai': params = CalculationMethod.Dubai(); break;
      case 'Qatar': params = CalculationMethod.Qatar(); break;
      case 'Kuwait': params = CalculationMethod.Kuwait(); break;
      case 'MoonsightingCommittee': params = CalculationMethod.MoonsightingCommittee(); break;
      case 'Singapore': params = CalculationMethod.Singapore(); break;
      case 'Turkey': params = CalculationMethod.Turkey(); break;
      case 'Tehran': params = CalculationMethod.Tehran(); break;
      case 'NorthAmerica': params = CalculationMethod.NorthAmerica(); break;
      default: params = CalculationMethod.MuslimWorldLeague();
    }
    
    params.madhab = Madhab.Shafi; // Default to Shafi (common in SE Asia)

    const times = new PrayerTimes(coordinates, date, params);
    setPrayerTimes(times);

    // Determine next prayer
    const now = new Date();
    let next = 'fajr';
    if (now < times.fajr) next = 'fajr';
    else if (now < times.dhuhr) next = 'dhuhr';
    else if (now < times.asr) next = 'asr';
    else if (now < times.maghrib) next = 'maghrib';
    else if (now < times.isha) next = 'isha';
    else next = 'fajr'; // Next day Fajr logic handled simply for now

    setNextPrayer(next);

  }, [location, calculationMethod]);

  return {
    location,
    setLocation,
    iqomahOffsets,
    setIqomahOffsets,
    calculationMethod,
    setCalculationMethod,
    prayerTimes,
    nextPrayer,
  };
}
