import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// ----------------------------------------------------
// 0. HEALTH CHECK & SYSTEM STATUS
// ----------------------------------------------------
const handleHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'SG Commuter Portal API',
    endpoints: {
      weather: '/api/weather/summary',
      transport: '/api/transport/taxi-availability',
      ltaBus: '/api/lta/bus-arrival',
      ltaAlerts: '/api/lta/train-alerts',
      smartAdvisory: '/api/commute/smart-advisory',
      motivation: '/api/punctual/motivate',
    },
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);
app.get('/api/status', handleHealth);

// Helper for HTTP requests with timeouts
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 7000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// ----------------------------------------------------
// 1. WEATHER & ENVIRONMENT (Data.gov.sg v2 host - keyless)
// ----------------------------------------------------

// 2-Hour Weather Forecast
app.get('/api/weather/two-hr-forecast', async (req: Request, res: Response) => {
  try {
    const dateParam = req.query.date ? `?date=${req.query.date}` : '';
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast${dateParam}`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching 2-hr forecast:', error.message);
    res.status(500).json({ error: 'Failed to fetch 2-hr weather forecast', details: error.message });
  }
});

// 24-Hour Weather Forecast
app.get('/api/weather/twenty-four-hr-forecast', async (req: Request, res: Response) => {
  try {
    const dateParam = req.query.date ? `?date=${req.query.date}` : '';
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast${dateParam}`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching 24-hr forecast:', error.message);
    res.status(500).json({ error: 'Failed to fetch 24-hr weather forecast', details: error.message });
  }
});

// 4-Day Outlook
app.get('/api/weather/four-day-outlook', async (req: Request, res: Response) => {
  try {
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching 4-day outlook:', error.message);
    res.status(500).json({ error: 'Failed to fetch 4-day outlook', details: error.message });
  }
});

// Air Temperature
app.get('/api/weather/air-temperature', async (req: Request, res: Response) => {
  try {
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/air-temperature`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching air temperature:', error.message);
    res.status(500).json({ error: 'Failed to fetch air temperature', details: error.message });
  }
});

// Rainfall
app.get('/api/weather/rainfall', async (req: Request, res: Response) => {
  try {
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/rainfall`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching rainfall:', error.message);
    res.status(500).json({ error: 'Failed to fetch rainfall data', details: error.message });
  }
});

// PSI (Pollutant Standards Index)
app.get('/api/weather/psi', async (req: Request, res: Response) => {
  try {
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/psi`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching PSI:', error.message);
    res.status(500).json({ error: 'Failed to fetch PSI data', details: error.message });
  }
});

// PM2.5
app.get('/api/weather/pm25', async (req: Request, res: Response) => {
  try {
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/pm25`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching PM2.5:', error.message);
    res.status(500).json({ error: 'Failed to fetch PM2.5 data', details: error.message });
  }
});

// UV Index
app.get('/api/weather/uv', async (req: Request, res: Response) => {
  try {
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/uv`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching UV index:', error.message);
    res.status(500).json({ error: 'Failed to fetch UV index', details: error.message });
  }
});

// Relative Humidity
app.get('/api/weather/relative-humidity', async (req: Request, res: Response) => {
  try {
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/relative-humidity`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching relative humidity:', error.message);
    res.status(500).json({ error: 'Failed to fetch relative humidity', details: error.message });
  }
});

// Wind Speed
app.get('/api/weather/wind-speed', async (req: Request, res: Response) => {
  try {
    const response = await fetchWithTimeout(`https://api-open.data.gov.sg/v2/real-time/api/wind-speed`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching wind speed:', error.message);
    res.status(500).json({ error: 'Failed to fetch wind speed', details: error.message });
  }
});

// Weather Combined / Summary Endpoint
app.get('/api/weather/summary', async (req: Request, res: Response) => {
  try {
    const [twoHrRes, tempRes, psiRes, uvRes, humidRes] = await Promise.allSettled([
      fetchWithTimeout('https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast'),
      fetchWithTimeout('https://api-open.data.gov.sg/v2/real-time/api/air-temperature'),
      fetchWithTimeout('https://api-open.data.gov.sg/v2/real-time/api/psi'),
      fetchWithTimeout('https://api-open.data.gov.sg/v2/real-time/api/uv'),
      fetchWithTimeout('https://api-open.data.gov.sg/v2/real-time/api/relative-humidity'),
    ]);

    const results: Record<string, any> = {};

    if (twoHrRes.status === 'fulfilled' && twoHrRes.value.ok) {
      results.twoHrForecast = await twoHrRes.value.json();
    }
    if (tempRes.status === 'fulfilled' && tempRes.value.ok) {
      results.airTemperature = await tempRes.value.json();
    }
    if (psiRes.status === 'fulfilled' && psiRes.value.ok) {
      results.psi = await psiRes.value.json();
    }
    if (uvRes.status === 'fulfilled' && uvRes.value.ok) {
      results.uv = await uvRes.value.json();
    }
    if (humidRes.status === 'fulfilled' && humidRes.value.ok) {
      results.humidity = await humidRes.value.json();
    }

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch weather summary', details: error.message });
  }
});

// ----------------------------------------------------
// 2. CARPARKS & TAXIS (Data.gov.sg v1 host - bare responses)
// ----------------------------------------------------

// Carpark Availability (Data.gov.sg v1)
app.get('/api/transport/carpark-availability', async (req: Request, res: Response) => {
  try {
    const dateParam = req.query.date_time ? `?date_time=${req.query.date_time}` : '';
    const response = await fetchWithTimeout(`https://api.data.gov.sg/v1/transport/carpark-availability${dateParam}`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching carpark availability:', error.message);
    res.status(500).json({ error: 'Failed to fetch carpark availability', details: error.message });
  }
});

// Taxi Availability (Data.gov.sg v1)
app.get('/api/transport/taxi-availability', async (req: Request, res: Response) => {
  try {
    const dateParam = req.query.date_time ? `?date_time=${req.query.date_time}` : '';
    const response = await fetchWithTimeout(`https://api.data.gov.sg/v1/transport/taxi-availability${dateParam}`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching taxi availability:', error.message);
    res.status(500).json({ error: 'Failed to fetch taxi availability', details: error.message });
  }
});

// ----------------------------------------------------
// 3. LTA DATAMALL (Requires AccountKey header)
// ----------------------------------------------------

const getLtaAccountKey = () => process.env.LTA_DATAMALL_KEY || process.env.LTA_ACCOUNT_KEY || process.env.LTA_API_KEY || '';

// Bus Arrival v3
app.get('/api/lta/bus-arrival', async (req: Request, res: Response) => {
  const { busStopCode, serviceNo } = req.query;
  if (!busStopCode) {
    return res.status(400).json({ error: 'busStopCode query parameter is required' });
  }

  const accountKey = getLtaAccountKey();
  const serviceParam = serviceNo ? `&ServiceNo=${serviceNo}` : '';
  const url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}${serviceParam}`;

  if (!accountKey) {
    // Graceful fallback simulation when AccountKey is not yet set in environment
    return res.json({
      fallback: true,
      message: 'Provide LTA_DATAMALL_KEY in environment for live LTA DataMall feeds. Showing live simulated feeds.',
      BusStopCode: busStopCode,
      Services: [
        {
          ServiceNo: (serviceNo as string) || '65',
          Operator: 'SBST',
          NextBus: {
            EstimatedArrival: new Date(Date.now() + 2 * 60000).toISOString(),
            Latitude: '1.3040',
            Longitude: '103.8320',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD',
          },
          NextBus2: {
            EstimatedArrival: new Date(Date.now() + 8 * 60000).toISOString(),
            Latitude: '1.3120',
            Longitude: '103.8400',
            VisitNumber: '1',
            Load: 'SDA',
            Feature: 'WAB',
            Type: 'SD',
          },
        },
        {
          ServiceNo: '14',
          Operator: 'SBST',
          NextBus: {
            EstimatedArrival: new Date(Date.now() + 4 * 60000).toISOString(),
            Latitude: '1.3010',
            Longitude: '103.8350',
            VisitNumber: '1',
            Load: 'LSD',
            Feature: 'WAB',
            Type: 'DD',
          },
        },
        {
          ServiceNo: '175',
          Operator: 'TTS',
          NextBus: {
            EstimatedArrival: new Date(Date.now() + 7 * 60000).toISOString(),
            Latitude: '1.3080',
            Longitude: '103.8290',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'SD',
          },
        },
        {
          ServiceNo: '5',
          Operator: 'SBST',
          NextBus: {
            EstimatedArrival: new Date(Date.now() + 11 * 60000).toISOString(),
            Latitude: '1.3150',
            Longitude: '103.8210',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD',
          },
        },
      ],
    });
  }

  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`LTA API responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching LTA BusArrival:', error.message);
    res.status(500).json({ error: 'Failed to fetch BusArrival from LTA DataMall', details: error.message });
  }
});

// Live Carpark Availability (HDB + LTA + URA)
app.get('/api/lta/carpark-availability', async (req: Request, res: Response) => {
  const accountKey = getLtaAccountKey();
  const url = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

  if (!accountKey) {
    return res.json({
      fallback: true,
      message: 'Set LTA_DATAMALL_KEY in environment for full LTA CarParkAvailabilityv2.',
      value: [
        { CarParkID: '1', Area: 'Orchard', Development: 'Tang Plaza', AvailableLots: 84, LotType: 'C', Agency: 'LTA' },
        { CarParkID: '2', Area: 'Orchard', Development: 'ION Orchard', AvailableLots: 132, LotType: 'C', Agency: 'LTA' },
        { CarParkID: '3', Area: 'Marina', Development: 'Suntec City', AvailableLots: 410, LotType: 'C', Agency: 'URA' },
        { CarParkID: '4', Area: 'CBD', Development: 'Raffles City', AvailableLots: 95, LotType: 'C', Agency: 'LTA' },
      ],
    });
  }

  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching LTA Carpark:', error.message);
    res.status(500).json({ error: 'Failed to fetch CarParkAvailability from LTA', details: error.message });
  }
});

// Traffic Incidents
app.get('/api/lta/traffic-incidents', async (req: Request, res: Response) => {
  const accountKey = getLtaAccountKey();
  const url = 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents';

  if (!accountKey) {
    return res.json({
      fallback: true,
      value: [
        {
          Type: 'Heavy Traffic',
          Latitude: 1.3048,
          Longitude: 103.8318,
          Message: '(27/8)18:30 Heavy traffic on Orchard Road towards Bras Basah. Expect +10 min delay.',
        },
        {
          Type: 'Roadwork',
          Latitude: 1.3210,
          Longitude: 103.8450,
          Message: '(27/8)17:45 Roadwork on CTE (towards AYE) after Braddell Rd Exit.',
        },
      ],
    });
  }

  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching TrafficIncidents:', error.message);
    res.status(500).json({ error: 'Failed to fetch TrafficIncidents from LTA', details: error.message });
  }
});

// Train Service Alerts
app.get('/api/lta/train-alerts', async (req: Request, res: Response) => {
  const accountKey = getLtaAccountKey();
  const url = 'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts';

  if (!accountKey) {
    return res.json({
      fallback: true,
      value: {
        Status: 1, // 1 = Normal / minor advisory, 2 = Disrupted
        AffectedSegments: [
          {
            Line: 'NEL',
            Direction: 'Punggol',
            Stations: 'NE12',
            FreePublicBus: 'N',
            FreeMRTShuttle: 'N',
            MRTShuttleDirection: '',
            Message: 'NEL Serangoon Stn experiencing slight signal delays (~5 mins additional travel time).',
          },
        ],
      },
    });
  }

  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching TrainServiceAlerts:', error.message);
    res.status(500).json({ error: 'Failed to fetch TrainServiceAlerts from LTA', details: error.message });
  }
});

// ----------------------------------------------------
// 4. GOOGLE MAPS VIA SERPAPI
// ----------------------------------------------------
app.get('/api/maps/search', async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const serpApiKey = process.env.SERPAPI_API_KEY;
  if (!serpApiKey) {
    return res.json({
      fallback: true,
      message: 'Set SERPAPI_API_KEY in environment for live SerpAPI Google Maps queries.',
      query: q,
      local_results: [
        {
          title: String(q),
          address: `${q}, Singapore`,
          gps_coordinates: { latitude: 1.3048, longitude: 103.8318 },
          rating: 4.6,
        },
      ],
    });
  }

  try {
    const url = `https://serpapi.com/search?engine=google_maps&q=${encodeURIComponent(String(q))}&api_key=${serpApiKey}`;
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error with SerpAPI Google Maps search:', error.message);
    res.status(500).json({ error: 'Failed to fetch Google Maps data via SerpAPI', details: error.message });
  }
});

// Helper for Gemini REST generation with Header auth
async function generateGeminiContent(prompt: string, apiKey: string, responseMimeType = 'application/json', temperature = 0.8) {
  const sanitizedKey = apiKey.replace(/^["']|["']$/g, '').trim();
  if (!sanitizedKey || sanitizedKey.includes('MY_GEMINI') || sanitizedKey === 'undefined') {
    return null;
  }

  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-3.7-flash',
  ];

  for (const model of candidateModels) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const response = await fetchWithTimeout(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': sanitizedKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType,
            temperature,
          },
        }),
      }, 6000);

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return candidateText;
        }
      } else if (response.status === 400 || response.status === 401 || response.status === 403) {
        // Stop if API key is invalid/unauthorized
        break;
      }
    } catch {
      // Continue to next model or fallback
    }
  }
  return null;
}

// ----------------------------------------------------
// 5. AI SMART TRANSIT ADVISORY (GEMINI API REST - x-goog-api-key in Header)
// ----------------------------------------------------
const handleSmartAdvisory = async (req: Request, res: Response) => {
  const { origin, destination, weatherCondition, isPeakHour } = req.body || {};
  const isRaining = weatherCondition?.toLowerCase().includes('rain') || weatherCondition?.toLowerCase().includes('thunder');

  const defaultAdvisory = {
    recommendedMode: 'mrt',
    headline: isRaining
      ? `Heavy Rain Detected: MRT is optimal from ${origin || 'Bishan'} to ${destination || 'Marina Bay Sands'}`
      : `Peak Commute: Take MRT to bypass road congestion to ${destination || 'Marina Bay Sands'}`,
    details: isRaining
      ? `Wet road conditions add 10-15 mins to road traffic. MRT offers sheltered connections, saving ~$14.70 - $19.20 compared to metered taxi fares.`
      : `High vehicle volume on expressways. MRT provides reliable transit without road delays or meter surcharges.`,
    confidence: 94,
    costSavings: '$14.70 - $19.20',
    timeSavings: '12 mins',
  };

  const rawKey = process.env.GEMINI_API_KEY;
  if (!rawKey) {
    return res.json(defaultAdvisory);
  }

  try {
    const prompt = `You are the AI Commuter Assistant for Singapore ("SG I am Late Pro").
Analyze this commute request:
- Origin: ${origin || 'Bishan Station'}
- Destination: ${destination || 'Marina Bay Sands'}
- Weather: ${weatherCondition || 'Scattered Thunderstorms'}
- Peak Hour: ${isPeakHour ? 'Yes' : 'No'}

Pricing Accuracy Mandate: In Singapore, standard metered taxis cost ~$15-$25 for typical 10-15km trips, while MRT costs ~$1.50-$2.30. Do NOT suggest inaccurate, fabricated surge numbers without basis. State realistic estimated savings compared to metered taxi range (e.g., "$14.00 - $19.00").

Respond ONLY with valid JSON in this exact structure:
{
  "recommendedMode": "mrt" | "bus" | "taxi",
  "headline": "Short crisp advice headline",
  "details": "Detailed 2-sentence rationale considering Singapore MRT sheltered connections, road congestion, LTA meter tariff, or bus occupancy.",
  "confidence": 92,
  "costSavings": "$14.70 - $19.20",
  "timeSavings": "12 mins"
}`;

    const text = await generateGeminiContent(prompt, rawKey, 'application/json', 0.5);
    if (text) {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    }
  } catch {
    // Fall back to rule-based advisory
  }

  return res.json(defaultAdvisory);
};

app.post('/api/commute/smart-advisory', handleSmartAdvisory);
app.post('/api/ai/smart-advisory', handleSmartAdvisory);

// ----------------------------------------------------
// 6. PUNCTUALITY MOTIVATOR & ENCOURAGEMENT GENERATOR (GEMINI API REST)
// ----------------------------------------------------
app.post('/api/punctual/motivate', async (req: Request, res: Response) => {
  const { tone = 'singlish', destination = 'work / meeting', currentDelayMin = 0, excludeQuote = '' } = req.body || {};

  // Distinct fallback banks tailored specifically to each of the 4 personas
  const personaFallbacks: Record<string, Array<{ quote: string; author: string; tag: string; punctualityTip: string }>> = {
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

  const normalizedTone = (tone.toLowerCase() === 'high-flyer' || tone.toLowerCase() === 'high_flyer') 
    ? 'inspirational' 
    : tone.toLowerCase();
  
  const personaQuotes = personaFallbacks[normalizedTone] || personaFallbacks.singlish;
  const filteredQuotes = excludeQuote 
    ? personaQuotes.filter((item) => item.quote !== excludeQuote)
    : personaQuotes;
  const quotePool = filteredQuotes.length > 0 ? filteredQuotes : personaQuotes;

  const rawKey = process.env.GEMINI_API_KEY;
  if (!rawKey) {
    const randomPick = quotePool[Math.floor(Math.random() * quotePool.length)];
    return res.json(randomPick);
  }

  // Define precise persona prompt instructions
  const personaGuidelines: Record<string, string> = {
    singlish: `PERSONA: Uncle / Auntie Singaporean Commuter Legend (Singlish Hype).
STYLE: Authentic, humorous, warm colloquial Singaporean Singlish. Use vibrant local terms like 'steady pom pi pi', 'kancheong spider', 'chop chop', 'kopi-o', 'alamak', 'chope', 'shiok', 'tapao', 'MRT doors closing'.
VOICE: Like a veteran Kopitiam Uncle, Bishan MRT marshall, or friendly hawker cheering you on.
AUTHOR: Authentic local character like 'Uncle Lim (Kopitiam Boss)' or 'Auntie Helen (Commuter Champion)'.
TAG: 'Singlish Hype'`,
    
    inspirational: `PERSONA: Shenton Way / CBD High-Flyer Executive (High-Flyer Hustle).
STYLE: Sharp, ambitious, high-energy executive mindset. Focus on time as high-value currency, competitive advantage, boardroom leadership, 6 AM club discipline, and winning the day before 9 AM.
VOICE: Elite venture capitalist, managing director, or performance strategist.
AUTHOR: High-powered professional like 'Marcus Vance (Shenton Way MD)' or 'Elena Neo (Venture Partner)'.
TAG: 'High-Flyer Hustle'`,

    witty: `PERSONA: Sarcastic, Relatable Modern Office Commuter (Witty Banter).
STYLE: Laugh-out-loud funny, sarcastic, clever observations about avoiding late eye-contact with the boss, Singapore's humid sprint vs glorious air-con train, saving cab surge money for boba, lift queues.
VOICE: A witty stand-up comedian or sarcastic corporate survivor.
AUTHOR: Character like 'Late-Again Larry (Office Comedian)' or 'Senior Swivel Chair Strategist'.
TAG: 'Witty Banter'`,

    zen: `PERSONA: Mindful Transit Monk (Zen Calm).
STYLE: Deeply soothing, peaceful, stoic, grounded, poetic. Emphasizes flowing with time, mindful breathing, seeing the MRT journey as a calm moving sanctuary rather than a chaotic rush.
VOICE: Serene meditation guide or Zen transit philosopher.
AUTHOR: Character like 'Master Kai (Commuter Zen Monk)' or 'The Mindful Commuter'.
TAG: 'Zen Calm'`
  };

  const personaInstruction = personaGuidelines[normalizedTone] || personaGuidelines.singlish;

  try {
    const prompt = `You are the Singapore Punctuality Coach ("SG I am Late Pro Punctuality Booster").
Generate a customized, highly encouraging punctuality message for a commuter heading to "${destination}".
${currentDelayMin > 0 ? `Current situation: Commuter is delayed by ${currentDelayMin} minutes, so provide an encouraging recovery push!` : 'Current situation: Commuter is heading out now to arrive ahead of time.'}
${excludeQuote ? `Do NOT repeat or use this quote: "${excludeQuote}"` : ''}

${personaInstruction}

CRITICAL RULES:
1. Strictly follow the assigned persona's distinct voice, vocabulary, and tone.
2. Provide 1 practical, actionable Singapore transit micro-tip (e.g. carriage door positioning, MRT air-con hack, SimplyGo tap shortcut, sheltered linkway) that matches the persona style.

Respond ONLY with valid JSON in this exact structure:
{
  "quote": "1-2 punchy, distinct sentences in full character voice",
  "author": "Persona character name with relevant title",
  "tag": "Tone label corresponding to persona",
  "punctualityTip": "1 practical actionable micro-tip for Singapore transit"
}`;

    const text = await generateGeminiContent(prompt, rawKey, 'application/json', 0.9);
    if (text) {
      const parsed = JSON.parse(text);
      if (parsed && parsed.quote) {
        return res.json(parsed);
      }
    }
  } catch {
    // Fall back to persona quotes smoothly
  }

  const randomPick = quotePool[Math.floor(Math.random() * quotePool.length)];
  return res.json(randomPick);
});

// ----------------------------------------------------
// VITE & STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SG I am Late Pro server running on http://0.0.0.0:${PORT}`);
  });
}

// Only launch standalone web server if not running in a Vercel Serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
