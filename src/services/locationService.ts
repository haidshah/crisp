import { useState, useEffect } from 'react';
import { UserLocationInfo, ProvinceCode } from '../types';
import { 
  CANADIAN_PROVINCES, 
  getProvinceByCode, 
  getProvinceTaxRate, 
  getProvinceTaxLabel, 
  isPrimaryServiceArea,
  findProvinceByCity
} from '../data/canadianLocations';

const LOCATION_STORAGE_KEY = 'crisp_user_location_v1';

// Default HQ location is Cambridge, Ontario
export const DEFAULT_LOCATION: UserLocationInfo = {
  city: 'Cambridge',
  province: 'ON',
  provinceName: 'Ontario',
  taxRate: 0.13,
  taxLabel: '13% HST',
  taxType: 'HST',
  isPrimaryArea: true,
  source: 'default_cambridge'
};

// Listeners for multi-component synchronization
type LocationListener = (loc: UserLocationInfo) => void;
const listeners: Set<LocationListener> = new Set();

function notifyListeners(loc: UserLocationInfo) {
  listeners.forEach(fn => {
    try {
      fn(loc);
    } catch (e) {
      console.warn('Location listener error:', e);
    }
  });
}

export class LocationService {
  private static cachedLocation: UserLocationInfo | null = null;

  static getCurrentLocation(): UserLocationInfo {
    if (this.cachedLocation) {
      return this.cachedLocation;
    }

    try {
      const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserLocationInfo;
        if (parsed.city && parsed.province) {
          this.cachedLocation = parsed;
          return parsed;
        }
      }
    } catch (e) {
      // Storage access failure fallback
    }

    // Default to Cambridge HQ
    this.cachedLocation = DEFAULT_LOCATION;
    return DEFAULT_LOCATION;
  }

  static setLocation(city: string, provinceCode: ProvinceCode, source: UserLocationInfo['source'] = 'manual_selection'): UserLocationInfo {
    const prov = getProvinceByCode(provinceCode) || CANADIAN_PROVINCES[0];
    const isPrimary = isPrimaryServiceArea(city, provinceCode);

    const newLoc: UserLocationInfo = {
      city: city.trim() || 'Cambridge',
      province: prov.code,
      provinceName: prov.name,
      taxRate: prov.taxRate,
      taxLabel: prov.taxLabel,
      taxType: prov.taxType,
      isPrimaryArea: isPrimary,
      source
    };

    this.cachedLocation = newLoc;
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLoc));
    } catch (e) {
      // Local storage fallback
    }

    notifyListeners(newLoc);
    return newLoc;
  }

  static async detectLocation(): Promise<UserLocationInfo> {
    // 1. Try Browser Geolocation API if available and permitted
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        const coords = await new Promise<GeolocationCoordinates | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            () => resolve(null),
            { timeout: 4000, maximumAge: 60000 }
          );
        });

        if (coords) {
          const detected = this.inferLocationFromCoords(coords.latitude, coords.longitude);
          if (detected) {
            return this.setLocation(detected.city, detected.province, 'auto_detected');
          }
        }
      } catch (err) {
        console.warn('Geolocation lookup skipped:', err);
      }
    }

    // 2. Try Timezone Heuristic
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const tzLoc = this.inferLocationFromTimezone(tz);
        if (tzLoc) {
          return this.setLocation(tzLoc.city, tzLoc.province, 'auto_detected');
        }
      } catch (e) {
        // Intl fallback
      }
    }

    // Fallback to default Cambridge
    return this.setLocation('Cambridge', 'ON', 'default_cambridge');
  }

  // Coordinate estimation for Canadian Metropolitan & Regional Hubs
  private static inferLocationFromCoords(lat: number, lng: number): { city: string; province: ProvinceCode } | null {
    // Cambridge / Kitchener-Waterloo / Tri-Cities (Approx 43.36° N, 80.31° W)
    if (lat >= 43.2 && lat <= 43.6 && lng >= -80.6 && lng <= -80.1) {
      return { city: 'Cambridge', province: 'ON' };
    }
    // Greater Toronto Area / Peel / York / Halton
    if (lat >= 43.5 && lat <= 44.0 && lng >= -80.0 && lng <= -79.1) {
      return { city: 'Toronto', province: 'ON' };
    }
    // Ottawa / Capital Region
    if (lat >= 45.2 && lat <= 45.6 && lng >= -76.0 && lng <= -75.4) {
      return { city: 'Ottawa', province: 'ON' };
    }
    // Greater Vancouver / Lower Mainland BC
    if (lat >= 49.0 && lat <= 49.5 && lng >= -123.4 && lng <= -122.5) {
      return { city: 'Vancouver', province: 'BC' };
    }
    // Victoria / Vancouver Island
    if (lat >= 48.3 && lat <= 48.7 && lng >= -123.6 && lng <= -123.2) {
      return { city: 'Victoria', province: 'BC' };
    }
    // Calgary AB
    if (lat >= 50.8 && lat <= 51.3 && lng >= -114.3 && lng <= -113.8) {
      return { city: 'Calgary', province: 'AB' };
    }
    // Edmonton AB
    if (lat >= 53.3 && lat <= 53.7 && lng >= -113.7 && lng <= -113.3) {
      return { city: 'Edmonton', province: 'AB' };
    }
    // Montreal QC
    if (lat >= 45.3 && lat <= 45.7 && lng >= -73.9 && lng <= -73.4) {
      return { city: 'Montreal', province: 'QC' };
    }
    // Quebec City QC
    if (lat >= 46.7 && lat <= 47.0 && lng >= -71.4 && lng <= -71.1) {
      return { city: 'Quebec City', province: 'QC' };
    }
    // Winnipeg MB
    if (lat >= 49.7 && lat <= 50.0 && lng >= -97.3 && lng <= -96.9) {
      return { city: 'Winnipeg', province: 'MB' };
    }
    // Halifax NS
    if (lat >= 44.5 && lat <= 44.8 && lng >= -63.7 && lng <= -63.4) {
      return { city: 'Halifax', province: 'NS' };
    }

    // Rough bounding box for Canada
    if (lat >= 42.0 && lat <= 70.0 && lng >= -141.0 && lng <= -52.0) {
      // Defaults to Ontario / Cambridge
      return { city: 'Cambridge', province: 'ON' };
    }

    return null;
  }

  // Timezone heuristic for Canadian Regions
  private static inferLocationFromTimezone(tz: string): { city: string; province: ProvinceCode } | null {
    const lower = tz.toLowerCase();
    if (lower.includes('vancouver')) {
      return { city: 'Vancouver', province: 'BC' };
    }
    if (lower.includes('edmonton')) {
      return { city: 'Calgary', province: 'AB' };
    }
    if (lower.includes('winnipeg')) {
      return { city: 'Winnipeg', province: 'MB' };
    }
    if (lower.includes('regina')) {
      return { city: 'Saskatoon', province: 'SK' };
    }
    if (lower.includes('halifax') || lower.includes('moncton') || lower.includes('glace_bay')) {
      return { city: 'Halifax', province: 'NS' };
    }
    if (lower.includes('st_johns')) {
      return { city: "St. John's", province: 'NL' };
    }
    if (lower.includes('montreal')) {
      return { city: 'Montreal', province: 'QC' };
    }
    if (lower.includes('toronto')) {
      // Primary HQ Focus is Cambridge, Ontario
      return { city: 'Cambridge', province: 'ON' };
    }
    return null;
  }
}

// React Hook for dynamic location awareness
export function useUserLocation() {
  const [location, setLocationState] = useState<UserLocationInfo>(LocationService.getCurrentLocation());
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    // Register listener for sync
    const handleUpdate = (newLoc: UserLocationInfo) => {
      setLocationState(newLoc);
    };
    listeners.add(handleUpdate);

    // Auto-detect on first load if default
    if (location.source === 'default_cambridge') {
      setIsDetecting(true);
      LocationService.detectLocation()
        .then(loc => setLocationState(loc))
        .finally(() => setIsDetecting(false));
    }

    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const selectCityAndProvince = (city: string, province: ProvinceCode) => {
    const updated = LocationService.setLocation(city, province, 'manual_selection');
    setLocationState(updated);
  };

  const triggerDetection = async () => {
    setIsDetecting(true);
    try {
      const detected = await LocationService.detectLocation();
      setLocationState(detected);
      return detected;
    } finally {
      setIsDetecting(false);
    }
  };

  return {
    location,
    isDetecting,
    selectCityAndProvince,
    triggerDetection
  };
}
