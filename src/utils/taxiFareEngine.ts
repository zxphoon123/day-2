// Singapore Transit & Taxi Fare Accuracy Engine
// Conforms to Land Transport Authority (LTA) and Public Transport Council (PTC) fare structures.

export interface LocationCoord {
  name: string;
  lat: number;
  lng: number;
  isCbd?: boolean;
  isAirport?: boolean;
}

export const SG_LOCATIONS: Record<string, LocationCoord> = {
  'bishan': { name: 'Bishan Junction 8', lat: 1.3508, lng: 103.8485 },
  'bishan interchange': { name: 'Bishan Interchange', lat: 1.3508, lng: 103.8485 },
  'marina bay sands': { name: 'Marina Bay Sands', lat: 1.2834, lng: 103.8607, isCbd: true },
  'mbs': { name: 'Marina Bay Sands', lat: 1.2834, lng: 103.8607, isCbd: true },
  'raffles place': { name: 'Raffles Place / CBD', lat: 1.2839, lng: 103.8515, isCbd: true },
  'cbd': { name: 'Central Business District', lat: 1.2830, lng: 103.8520, isCbd: true },
  'orchard': { name: 'Orchard / Tang Plaza', lat: 1.3048, lng: 103.8318, isCbd: true },
  'tang plaza': { name: 'Tang Plaza Orchard', lat: 1.3048, lng: 103.8318, isCbd: true },
  'jurong east': { name: 'Jurong East Interchange', lat: 1.3331, lng: 103.7423 },
  'tampines': { name: 'Tampines Hub', lat: 1.3532, lng: 103.9452 },
  'woodlands': { name: 'Woodlands Integrated Transport Hub', lat: 1.4360, lng: 103.7865 },
  'changi airport': { name: 'Changi Airport T3', lat: 1.3644, lng: 103.9915, isAirport: true },
  'changi': { name: 'Changi Airport', lat: 1.3644, lng: 103.9915, isAirport: true },
  'ang mo kio': { name: 'Ang Mo Kio Hub', lat: 1.3698, lng: 103.8495 },
  'bedok': { name: 'Bedok Mall / Interchange', lat: 1.3240, lng: 103.9300 },
  'clementi': { name: 'Clementi Central', lat: 1.3152, lng: 103.7650 },
  'buona vista': { name: 'Buona Vista / One-North', lat: 1.3072, lng: 103.7900 },
  'novena': { name: 'Novena Square', lat: 1.3204, lng: 103.8438 },
  'serangoon': { name: 'Serangoon NEX', lat: 1.3497, lng: 103.8736 },
  'harbourfront': { name: 'HarbourFront / VivoCity', lat: 1.2653, lng: 103.8222 },
  'punggol': { name: 'Punggol Waterway Point', lat: 1.4052, lng: 103.9023 },
  'sengkang': { name: 'Sengkang Compass One', lat: 1.3917, lng: 103.8953 },
  'yishun': { name: 'Yishun Northpoint City', lat: 1.4295, lng: 103.8350 },
  'bugis': { name: 'Bugis Junction', lat: 1.3006, lng: 103.8559, isCbd: true },
  'chinatown': { name: 'Chinatown Point', lat: 1.2848, lng: 103.8440, isCbd: true },
  'shenton way': { name: 'Shenton Way / Financial Centre', lat: 1.2778, lng: 103.8504, isCbd: true },
  'tanah merah': { name: 'Tanah Merah', lat: 1.3273, lng: 103.9463 },
  'pasir ris': { name: 'Pasir Ris White Sands', lat: 1.3730, lng: 103.9493 },
  'queenstown': { name: 'Queenstown', lat: 1.2948, lng: 103.8059 },
};

/**
 * Finds matching coordinate or defaults based on text similarity
 */
export function resolveLocation(text: string): LocationCoord | null {
  if (!text || !text.trim()) return null;
  const clean = text.toLowerCase().trim();

  // Exact or contains match
  for (const [key, loc] of Object.entries(SG_LOCATIONS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return loc;
    }
  }

  // Fallback match parts
  const words = clean.split(/\s+/);
  for (const word of words) {
    if (word.length >= 3) {
      for (const [key, loc] of Object.entries(SG_LOCATIONS)) {
        if (key.includes(word)) {
          return loc;
        }
      }
    }
  }

  return null;
}

/**
 * Haversine formula distance with road route curvature multiplier (1.28x)
 */
export function calculateRoadDistanceKm(loc1: LocationCoord, loc2: LocationCoord): number {
  const R = 6371; // Earth radius in km
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;

  // Singapore road network winding factor is ~1.25x - 1.32x
  const roadDistance = straightLine * 1.28;
  return Math.max(1.5, Math.round(roadDistance * 10) / 10);
}

/**
 * PTC Distance-based Adult Card Fare (MRT / Bus)
 */
export function calculatePublicTransitFare(distanceKm: number): {
  mrtFare: number;
  busFare: number;
} {
  // PTC 2024-2025 standard adult card fare curve:
  // Base fare up to 3.2km: $1.09
  // Increasing incrementally to ~$2.37 for >40km
  let fare = 1.09;
  if (distanceKm > 3.2) {
    const extraKm = distanceKm - 3.2;
    fare += extraKm * 0.045; // ~4.5 cents per km on average
  }
  fare = Math.min(2.37, Math.max(1.09, fare));
  const rounded = Math.round(fare * 100) / 100;
  return {
    mrtFare: rounded,
    busFare: Math.max(1.09, Math.round((rounded - 0.15) * 100) / 100),
  };
}

/**
 * Direct breakdown calculator for arbitrary parameters
 */
export function calculateRegulatedTaxiFare(
  distanceKm: number,
  isPeak: boolean = true,
  isMidnight: boolean = false,
  isCbd: boolean = true
): {
  flagDown: number;
  distanceCharge: number;
  peakSurcharge: number;
  midnightSurcharge: number;
  cbdSurcharge: number;
  totalFare: number;
} {
  const flagDown = 4.4;
  let distanceCharge = 0;
  if (distanceKm > 1.0) {
    const kmUnder10 = Math.min(distanceKm - 1.0, 9.0);
    distanceCharge += kmUnder10 * 0.65;
    if (distanceKm > 10.0) {
      const kmOver10 = distanceKm - 10.0;
      distanceCharge += kmOver10 * 0.743;
    }
  }

  const baseFare = flagDown + distanceCharge;
  const peakSurcharge = isPeak && !isMidnight ? baseFare * 0.25 : 0;
  const midnightSurcharge = isMidnight ? baseFare * 0.5 : 0;
  const cbdSurcharge = isCbd ? 3.0 : 0;

  const totalFare = Math.round((baseFare + peakSurcharge + midnightSurcharge + cbdSurcharge) * 100) / 100;

  return {
    flagDown,
    distanceCharge: Math.round(distanceCharge * 100) / 100,
    peakSurcharge: Math.round(peakSurcharge * 100) / 100,
    midnightSurcharge: Math.round(midnightSurcharge * 100) / 100,
    cbdSurcharge,
    totalFare,
  };
}

export interface TaxiFareVerification {
  distanceKm: number;
  isLocationVerified: boolean;
  meteredBaseFare: number;
  meteredLow: number;
  meteredHigh: number;
  isPeakHour: boolean;
  isMidnight: boolean;
  hasCbdSurcharge: boolean;
  hasAirportSurcharge: boolean;
  estimatedErp: number;
  // Crucial accuracy flags:
  isSurgeVerified: boolean; // false because no live third-party surge API exists in open gov data
  accuracyStatus: 'verified_regulated_meter' | 'unverified_surge' | 'location_unresolved';
  accuracyNote: string;
  recommendedDisplayPrice: string;
  surgeWarning?: string;
  savingsVsTransit: {
    minSavings: number;
    maxSavings: number;
    formatted: string;
  };
}

/**
 * Calculates verified Singapore standard taxi meter fare according to LTA/PTC regulations.
 * Explicitly guards against misleading dynamic surge claims when real-time surge data is not available.
 */
export function verifyTaxiPrice(
  originStr: string,
  destStr: string,
  customHour?: number
): TaxiFareVerification {
  const originLoc = resolveLocation(originStr);
  const destLoc = resolveLocation(destStr);

  const isLocationVerified = !!(originLoc && destLoc);
  const distanceKm = isLocationVerified
    ? calculateRoadDistanceKm(originLoc!, destLoc!)
    : 12.5; // fallback default (Bishan to CBD standard distance)

  const date = new Date();
  const currentHour = customHour !== undefined ? customHour : date.getHours();
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  // LTA Regulated Surcharges:
  // Peak Hour: Mon-Fri 6:00-9:30 AM (25%) AND Daily 5:00-11:59 PM (25%)
  const isMorningPeak = isWeekday && currentHour >= 6 && currentHour < 10;
  const isEveningPeak = currentHour >= 17 && currentHour < 24;
  const isPeakHour = isMorningPeak || isEveningPeak;

  // Midnight: 12:00 AM - 5:59 AM (50%)
  const isMidnight = currentHour >= 0 && currentHour < 6;

  // CBD Surcharge: $3.00 (5:00 PM - 11:59 PM daily for CBD pickups/dropoffs)
  const isCbd = !!(originLoc?.isCbd || destLoc?.isCbd);
  const hasCbdSurcharge = isCbd && currentHour >= 17 && currentHour < 24;

  // Airport Surcharge: $3.00 - $5.00
  const hasAirportSurcharge = !!(originLoc?.isAirport || destLoc?.isAirport);

  // ERP estimate: $1.00 - $2.00 if peak hour heading into CBD
  const estimatedErp = (isPeakHour && isCbd) ? 2.0 : 0;

  // LTA Standard 4-Seater Meter Rate:
  // Flag-down: $4.40 (1st km)
  // 1km to 10km: $0.26 / 400m = $0.65 / km
  // > 10km: $0.26 / 350m = $0.743 / km
  let rawMeter = 4.4;
  if (distanceKm > 1.0) {
    const kmUnder10 = Math.min(distanceKm - 1.0, 9.0);
    rawMeter += kmUnder10 * 0.65;
    if (distanceKm > 10.0) {
      const kmOver10 = distanceKm - 10.0;
      rawMeter += kmOver10 * 0.743;
    }
  }

  // Add traffic delay buffer (~5-8% waiting time)
  const baseMeterWithWaiting = rawMeter * 1.06;

  let multiplier = 1.0;
  if (isMidnight) {
    multiplier = 1.5;
  } else if (isPeakHour) {
    multiplier = 1.25;
  }

  const surchargeAdditions =
    (hasCbdSurcharge ? 3.0 : 0) +
    (hasAirportSurcharge ? 5.0 : 0) +
    estimatedErp;

  const calculatedMeter = baseMeterWithWaiting * multiplier + surchargeAdditions;
  const meteredLow = Math.max(8.0, Math.round((calculatedMeter * 0.92) * 10) / 10);
  const meteredHigh = Math.max(10.0, Math.round((calculatedMeter * 1.12) * 10) / 10);

  const transitFare = calculatePublicTransitFare(distanceKm).mrtFare;
  const minSavings = Math.max(0, Math.round((meteredLow - transitFare) * 100) / 100);
  const maxSavings = Math.max(0, Math.round((meteredHigh - transitFare) * 100) / 100);

  if (!isLocationVerified) {
    return {
      distanceKm: 0,
      isLocationVerified: false,
      meteredBaseFare: 0,
      meteredLow: 0,
      meteredHigh: 0,
      isPeakHour,
      isMidnight,
      hasCbdSurcharge,
      hasAirportSurcharge,
      estimatedErp: 0,
      isSurgeVerified: false,
      accuracyStatus: 'location_unresolved',
      accuracyNote: 'Location not matched to verified road matrix. Live taxi fare cannot be quoted with certainty.',
      recommendedDisplayPrice: 'Check Booking App (Unverified)',
      surgeWarning: 'Dynamic surge pricing varies in real-time. Please refer to CDG Zig or Grab.',
      savingsVsTransit: {
        minSavings: 0,
        maxSavings: 0,
        formatted: 'Dynamic',
      },
    };
  }

  return {
    distanceKm,
    isLocationVerified: true,
    meteredBaseFare: Math.round(calculatedMeter * 100) / 100,
    meteredLow,
    meteredHigh,
    isPeakHour,
    isMidnight,
    hasCbdSurcharge,
    hasAirportSurcharge,
    estimatedErp,
    isSurgeVerified: false, // Open data has taxi locations, but NO real-time dynamic surge API
    accuracyStatus: 'verified_regulated_meter',
    accuracyNote: `LTA standard metered rate (${distanceKm} km${isPeakHour ? ' • 25% peak surcharge' : ''}${hasCbdSurcharge ? ' • $3 CBD surcharge' : ''})`,
    recommendedDisplayPrice: `~$${meteredLow.toFixed(2)} - $${meteredHigh.toFixed(2)}`,
    surgeWarning: 'Private ride-hail dynamic surge (1.2x–2.5x during rain/rush) is unverified via third-party APIs. Open CDG Zig / Grab for binding quotes.',
    savingsVsTransit: {
      minSavings,
      maxSavings,
      formatted: `$${minSavings.toFixed(2)} - $${maxSavings.toFixed(2)}`,
    },
  };
}
