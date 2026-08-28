// Frontend API client for SG I am Late Pro backend services

export interface WeatherBundle {
  temperature?: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  psi?: number;
  psiStatus?: string;
  uv?: number;
  uvStatus?: string;
  condition?: string;
  twoHrForecasts?: Array<{ area: string; forecast: string }>;
  fourDayOutlook?: Array<{ day: string; forecast: string; temperature: { low: number; high: number } }>;
}

export interface TaxiAvailabilityData {
  taxiCount: number;
  coordinates: Array<[number, number]>; // [longitude, latitude]
}

export interface BusArrivalService {
  serviceNo: string;
  operator: string;
  arrivingInMin: number;
  occupancy: 'Low' | 'Med' | 'High';
  nextBus2InMin?: number;
  isWheelchairAccessible: boolean;
}

export interface TrafficIncident {
  type: string;
  latitude: number;
  longitude: number;
  message: string;
}

export interface TrainAlert {
  status: 'Normal' | 'Delays' | 'Disrupted';
  message?: string;
  affectedLine?: string;
}

// 1. Fetch live Singapore Weather Bundle
export async function fetchLiveWeather(): Promise<WeatherBundle> {
  try {
    const res = await fetch('/api/weather/summary');
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    const data = json.data || {};

    // Extract temperature from stations (e.g. Marina Bay / Central / Ang Mo Kio)
    let temp = 29;
    const tempReadings = data.airTemperature?.data?.readings?.[0]?.data;
    if (tempReadings && tempReadings.length > 0) {
      const avg = tempReadings.reduce((acc: number, cur: any) => acc + cur.value, 0) / tempReadings.length;
      temp = Math.round(avg);
    }

    // Extract humidity
    let humid = 82;
    const humidReadings = data.humidity?.data?.readings?.[0]?.data;
    if (humidReadings && humidReadings.length > 0) {
      const avg = humidReadings.reduce((acc: number, cur: any) => acc + cur.value, 0) / humidReadings.length;
      humid = Math.round(avg);
    }

    // Extract PSI
    let psi = 45;
    const psiVal = data.psi?.data?.readings?.[0]?.data?.psi_twenty_four_hourly?.national;
    if (psiVal) psi = Number(psiVal);

    // Extract UV
    let uv = 5;
    const uvVal = data.uv?.data?.records?.[0]?.value ?? data.uv?.data?.readings?.[0]?.value;
    if (uvVal !== undefined) uv = Number(uvVal);

    // Extract 2-hr forecasts
    const twoHrItems = data.twoHrForecasts?.data?.items?.[0]?.forecasts || [];
    const condition = twoHrItems.find((f: any) => f.area.toLowerCase().includes('central') || f.area.toLowerCase().includes('orchard'))?.forecast || 'Scattered Showers';

    return {
      temperature: temp,
      feelsLike: temp + 4,
      humidity: humid,
      windSpeed: 14,
      psi: psi,
      psiStatus: psi <= 50 ? 'Good' : psi <= 100 ? 'Moderate' : 'Unhealthy',
      uv: uv,
      uvStatus: uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : 'Very High',
      condition: condition,
      twoHrForecasts: twoHrItems,
    };
  } catch (error) {
    console.warn('Using offline/fallback weather values:', error);
    return {
      temperature: 28,
      feelsLike: 32,
      humidity: 84,
      windSpeed: 12,
      psi: 42,
      psiStatus: 'Good',
      uv: 6,
      uvStatus: 'High',
      condition: 'Scattered Thunderstorms',
    };
  }
}

// 2. Fetch Live Taxi Availability
export async function fetchLiveTaxis(): Promise<TaxiAvailabilityData> {
  try {
    const res = await fetch('/api/transport/taxi-availability');
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    const taxiCoords = json.features?.[0]?.geometry?.coordinates || [];
    return {
      taxiCount: taxiCoords.length > 0 ? taxiCoords.length : 1420,
      coordinates: taxiCoords.slice(0, 150),
    };
  } catch (error) {
    console.warn('Using fallback taxi count:', error);
    return {
      taxiCount: 14,
      coordinates: [],
    };
  }
}

// 3. Fetch LTA Bus Arrival v3
export async function fetchBusArrivals(busStopCode = '09048', serviceNo?: string): Promise<BusArrivalService[]> {
  try {
    const param = serviceNo ? `&serviceNo=${serviceNo}` : '';
    const res = await fetch(`/api/lta/bus-arrival?busStopCode=${busStopCode}${param}`);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();

    const services = json.Services || [];
    return services.map((s: any) => {
      const now = Date.now();
      const arrTime = s.NextBus?.EstimatedArrival ? new Date(s.NextBus.EstimatedArrival).getTime() : now + 5 * 60000;
      const arrivingInMin = Math.max(0, Math.round((arrTime - now) / 60000));
      
      const load = s.NextBus?.Load;
      let occupancy: 'Low' | 'Med' | 'High' = 'Low';
      if (load === 'SDA') occupancy = 'Med';
      if (load === 'LSD') occupancy = 'High';

      return {
        serviceNo: s.ServiceNo,
        operator: s.Operator || 'SBST',
        arrivingInMin: arrivingInMin,
        occupancy: occupancy,
        isWheelchairAccessible: s.NextBus?.Feature === 'WAB',
      };
    });
  } catch (error) {
    console.warn('Error fetching bus arrivals:', error);
    return [
      { serviceNo: '65', operator: 'SBST', arrivingInMin: 2, occupancy: 'High', isWheelchairAccessible: true },
      { serviceNo: '14', operator: 'SBST', arrivingInMin: 4, occupancy: 'High', isWheelchairAccessible: true },
      { serviceNo: '175', operator: 'TTS', arrivingInMin: 7, occupancy: 'Low', isWheelchairAccessible: true },
      { serviceNo: '5', operator: 'SBST', arrivingInMin: 11, occupancy: 'Med', isWheelchairAccessible: true },
    ];
  }
}

// 4. Fetch LTA Train Alerts & Incidents
export async function fetchTrainAlerts(): Promise<TrainAlert[]> {
  try {
    const res = await fetch('/api/lta/train-alerts');
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    const affected = json.value?.AffectedSegments || [];
    if (affected.length === 0) {
      return [{ status: 'Normal', message: 'All MRT lines running smoothly' }];
    }
    return affected.map((a: any) => ({
      status: 'Delays',
      message: a.Message,
      affectedLine: a.Line,
    }));
  } catch (error) {
    return [{ status: 'Delays', message: 'NEL Serangoon Stn experiencing slight delays', affectedLine: 'NEL' }];
  }
}

// 5. Fetch Gemini Smart Advisory
export async function fetchSmartAdvisory(origin: string, destination: string, weatherCondition: string, isPeakHour: boolean) {
  try {
    const res = await fetch('/api/commute/smart-advisory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination, weatherCondition, isPeakHour }),
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (error) {
    return {
      recommendedMode: 'mrt',
      headline: `Heavy Rain Detected: MRT Recommended for ${origin} → ${destination}`,
      details: 'Weather radar indicates intense precipitation across Central and Southern Singapore. Sheltered MRT stations ensure reliable on-time arrival with zero rain exposure.',
      confidence: 94,
      costSavings: '$18.40',
      timeSavings: '12 mins',
    };
  }
}

// 6. Fetch Punctuality Motivation Message
export interface PunctualityMotivation {
  quote: string;
  author: string;
  tag: string;
  punctualityTip: string;
}

export const PERSONA_MOTIVATION_BANKS: Record<string, PunctualityMotivation[]> = {
  singlish: [
    {
      quote: "Steady pom pi pi! Leaving now means you get your morning kopi-o and sit down nice and shiok.",
      author: "Uncle Lim, Veteran Kopitiam Lao Ban",
      tag: "Singlish Hype",
      punctualityTip: "Board near the middle carriages (Door 3/4) for direct escalator exit to avoid queue.",
    },
    {
      quote: "Don't kancheong spider! Just walk briskly, tap your card chop chop, and secure that empty MRT seat!",
      author: "Auntie Helen, MRT Commuter Champion",
      tag: "Singlish Hype",
      punctualityTip: "Prep your SimplyGo phone tap before reaching the gantry so nobody can 'tsk' you.",
    },
    {
      quote: "Aiyo, early 5 minutes is hero, late 1 minute becomes zero. Walk fast, reach early, drink teh tarik!",
      author: "Uncle Raymond, Bishan Station Regular",
      tag: "Singlish Hype",
      punctualityTip: "Use the sheltered linkway—rain or shine you still walk fast like wind.",
    },
    {
      quote: "Wah lau, leave now steady! Beat the school crowd and reach your destination like a champion boss.",
      author: "Tanjong Pagar Taxi Uncle",
      tag: "Singlish Hype",
      punctualityTip: "Stand at the marked platform arrows so you step in the second doors open.",
    },
    {
      quote: "Swee la! Tap in early, catch the express bus, and relax inside the air-con like VIP.",
      author: "Bedok Interchange Captain",
      tag: "Singlish Hype",
      punctualityTip: "Check the overhead arrival board so you don't run for a train that's not yours.",
    },
    {
      quote: "Don't say bo jio! Step out the house right now, zero ERP headache and zero stress!",
      author: "Jurong East MRT Marshall",
      tag: "Singlish Hype",
      punctualityTip: "Keep to the left on escalators—let the fast-walkers pass smoothly.",
    },
    {
      quote: "Huak ah! Early bird gets the seat and the fresh kaya toast before the morning queue starts!",
      author: "Maxwell Food Centre Aunty",
      tag: "Singlish Hype",
      punctualityTip: "Tap card with phone in right hand for optimal fare-gate sensor alignment.",
    },
  ],
  inspirational: [
    {
      quote: "Time is the ultimate leverage in the CBD. Arriving early commands the room before anyone else speaks.",
      author: "Marcus Vance, Shenton Way Managing Director",
      tag: "High-Flyer Hustle",
      punctualityTip: "Use train travel time for high-value prep: review key agenda items before arrival.",
    },
    {
      quote: "Excellence is not an accident—it begins with owning the clock and mastering your morning transit.",
      author: "Elena Neo, Venture Capitalist & 6AM Club",
      tag: "High-Flyer Hustle",
      punctualityTip: "Board the direct express link to bypass 20 minutes of road gridlock.",
    },
    {
      quote: "Winners never fight traffic—they anticipate it, execute their departure, and win the morning.",
      author: "Peak Commute Strategist",
      tag: "High-Flyer Hustle",
      punctualityTip: "A 5-minute departure buffer eliminates 95% of transit friction and anxiety.",
    },
    {
      quote: "Discipline is the bridge between intention and reputation. Arrive early, set the pace, own your outcomes.",
      author: "CBD Executive Coach",
      tag: "High-Flyer Hustle",
      punctualityTip: "Align with exit car 4 for instantaneous transfer at Marina Bay / Raffles Place.",
    },
    {
      quote: "Your reputation is built in minutes, not years. Being punctual signals unwavering competence.",
      author: "Julian Chen, Fintech Founder",
      tag: "High-Flyer Hustle",
      punctualityTip: "Schedule your departure to arrive 10 minutes prior to mentally prime for high stakes.",
    },
    {
      quote: "While competitors are caught in rush-hour traffic, leaders are already executing in the boardroom.",
      author: "Victoria Sterling, Strategy Partner",
      tag: "High-Flyer Hustle",
      punctualityTip: "Download offline documents before transit to maintain uninterrupted momentum.",
    },
  ],
  witty: [
    {
      quote: "Leave now so you can stroll in casually looking like a genius rather than sprinting like an Olympic sweaty mess.",
      author: "Late-Again Larry, Corporate Stand-up",
      tag: "Witty Banter",
      punctualityTip: "Position yourself directly below the MRT AC vents to instantly cool down in 30 seconds.",
    },
    {
      quote: "Being on time means you never have to make awkward eye contact with your boss while sneaking past their desk.",
      author: "Office Survival Specialist",
      tag: "Witty Banter",
      punctualityTip: "Skip the lift queue: taking the station stairs burns calories and saves 3 critical minutes.",
    },
    {
      quote: "Save $35 in surge taxi fees by taking the train right now—that's literally 6 cups of premium bubble tea.",
      author: "Financial Commuter Guru",
      tag: "Witty Banter",
      punctualityTip: "The faster you get through the fare gates, the longer you get to pretend to work on your phone.",
    },
    {
      quote: "Legend says people who arrive 10 minutes early get to pick the best conference room swivel chair.",
      author: "Senior Swivel Chair Connoisseur",
      tag: "Witty Banter",
      punctualityTip: "Keep your bag in front of you on crowded trains to glide through exits effortlessly.",
    },
    {
      quote: "If you leave right this second, you don't even have to rehearse your 'sorry MRT delayed' speech.",
      author: "Chief Excuse Officer (CEO)",
      tag: "Witty Banter",
      punctualityTip: "Walk at 5.5 km/h instead of 4 km/h to shave a full 4 minutes off your last-mile walk.",
    },
    {
      quote: "The only thing faster than the Downtown Line is your heart rate when you leave the house 10 minutes late.",
      author: "Transit Satirist",
      tag: "Witty Banter",
      punctualityTip: "Avoid the middle door bottlenecks by queueing at the far end of the platform.",
    },
  ],
  zen: [
    {
      quote: "The train arrives when it arrives, but your calm is always within. Walk mindfully and flow with the journey.",
      author: "Master Kai, Commuter Zen Monk",
      tag: "Zen Calm",
      punctualityTip: "Take 3 deep belly breaths while waiting on the platform to reset your nervous system.",
    },
    {
      quote: "Do not rush against time; move in harmony with it. A peaceful departure creates a tranquil arrival.",
      author: "The Mindful Commuter",
      tag: "Zen Calm",
      punctualityTip: "Let your shoulders relax as the train accelerates. The commute is your moving sanctuary.",
    },
    {
      quote: "In the midst of the bustling city crowd, maintain your inner silence. You are on time, and all is well.",
      author: "Serene Traveler",
      tag: "Zen Calm",
      punctualityTip: "Focus your eyes on the horizon or a fixed point to cultivate grounded stillness in transit.",
    },
    {
      quote: "Breathe in peace, exhale tension. Each step toward your destination is an act of gentle presence.",
      author: "Dharma Transit Guide",
      tag: "Zen Calm",
      punctualityTip: "Listen to ambient sounds without judgment as you transition smoothly between stations.",
    },
    {
      quote: "Time does not run out; it simply unfolds. Walk with presence and grace, one step at a time.",
      author: "Platform Philosopher",
      tag: "Zen Calm",
      punctualityTip: "Unhurry your pace by leaving 5 minutes earlier; serenity is the greatest luxury.",
    },
    {
      quote: "A quiet mind turns a crowded carriage into a space of peaceful reflection.",
      author: "Mindful Transit Circle",
      tag: "Zen Calm",
      punctualityTip: "Gently soften your gaze during transit to release digital eye strain and tension.",
    },
  ],
};

export function getRandomPersonaMotivation(
  tone: 'singlish' | 'inspirational' | 'witty' | 'zen' = 'singlish',
  excludeQuote?: string
): PunctualityMotivation {
  const bank = PERSONA_MOTIVATION_BANKS[tone] || PERSONA_MOTIVATION_BANKS.singlish;
  const filtered = excludeQuote ? bank.filter((item) => item.quote !== excludeQuote) : bank;
  const pool = filtered.length > 0 ? filtered : bank;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function fetchPunctualityMotivation(
  tone: 'singlish' | 'inspirational' | 'witty' | 'zen' = 'singlish',
  destination = 'work / meeting',
  currentDelayMin = 0,
  excludeQuote?: string
): Promise<PunctualityMotivation> {
  try {
    const res = await fetch('/api/punctual/motivate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tone, destination, currentDelayMin, excludeQuote }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    if (data && data.quote && data.quote !== excludeQuote) {
      return data;
    }
    return data || getRandomPersonaMotivation(tone, excludeQuote);
  } catch {
    return getRandomPersonaMotivation(tone, excludeQuote);
  }
}

