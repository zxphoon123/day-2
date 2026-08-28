import {
  RouteOption,
  DepartureItem,
  BusServiceItem,
  OdFlowItem,
  MrtLineStatus,
  CrowdForecastPoint,
  WeatherHourly,
} from '../types';

export const USER_PROFILE = {
  name: 'Sarah Chen',
  role: 'Senior Analyst • CBD Commuter',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
  preferredRoute: 'MRT (NSL > CCL)',
  homeLocation: 'Bishan Junction 8',
  officeLocation: 'Marina Bay Sands / Financial Centre',
};

export const INITIAL_ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'opt-taxi',
    type: 'taxi',
    name: 'Metered Taxi (LTA Rate)',
    subtext: 'LTA Meter • Surge Unverified',
    durationMin: 18,
    cost: 18.5,
    costRange: '$16.50 - $21.00',
    distanceKm: 12.5,
    surgeLevel: 'High Surge',
    statusColor: 'text-[#FF9A00]',
    fareAccuracyStatus: 'verified_meter',
    accuracyNote: 'Based on LTA standard 4-seater meter rate (12.5km + 25% peak + $3 CBD surcharge). Real-time private ride-hail surge is unverified without live booking API.',
    surgeWarning: 'Dynamic ride-hail surge fluctuates in real-time. Check CDG Zig / Grab for live quotes.',
  },
  {
    id: 'opt-mrt',
    type: 'mrt',
    name: 'MRT (NSL > CCL)',
    subtext: 'Regulated Transit Fare',
    durationMin: 24,
    cost: 1.8,
    distanceKm: 12.5,
    surgeLevel: 'Normal Crowd',
    statusColor: 'text-[#34C759]',
    isBest: true,
    mrtLines: ['#D42E12', '#FF9A00'],
    fareAccuracyStatus: 'accurate_transit',
    accuracyNote: 'PTC regulated distance-based adult card fare ($1.80 for 12.5km journey).',
  },
  {
    id: 'opt-bus',
    type: 'bus',
    name: 'Bus 133',
    subtext: 'Regulated Transit Fare',
    durationMin: 35,
    cost: 1.65,
    distanceKm: 12.5,
    surgeLevel: 'Moderate Traffic',
    statusColor: 'text-[#FFCC00]',
    busNumber: '133',
    fareAccuracyStatus: 'accurate_transit',
    accuracyNote: 'PTC regulated distance-based adult bus fare.',
  },
];

export const NEARBY_DEPARTURES: {
  station: string;
  items: DepartureItem[];
}[] = [
  {
    station: 'Bishan MRT (NS17)',
    items: [
      {
        id: 'dep-1',
        stationName: 'Bishan MRT',
        lineCode: 'NSL',
        lineName: 'North South Line',
        destination: 'Marina South Pier',
        eta: '2 min',
        nextEta: '6 min',
        color: '#D42E12',
        textColor: '#FFFFFF',
        type: 'mrt',
      },
      {
        id: 'dep-2',
        stationName: 'Bishan MRT',
        lineCode: 'CCL',
        lineName: 'Circle Line',
        destination: 'Dhoby Ghaut',
        eta: '4 min',
        nextEta: '9 min',
        color: '#FF9A00',
        textColor: '#FFFFFF',
        type: 'mrt',
      },
    ],
  },
  {
    station: 'Opp Junction 8 (Bus Stop)',
    items: [
      {
        id: 'dep-3',
        stationName: 'Opp Junction 8',
        lineCode: '54',
        lineName: 'SBS Transit',
        destination: 'New Bridge Rd Ter',
        eta: 'Arriving',
        nextEta: '12 min',
        color: '#FFD200',
        textColor: '#FFD200',
        type: 'bus',
      },
    ],
  },
];

export const BUS_SERVICES: BusServiceItem[] = [
  {
    serviceNo: '65',
    destination: 'Tampines Int',
    arrivingInMin: 2,
    occupancy: 'Low',
    wheelchairAccessible: true,
  },
  {
    serviceNo: '14',
    destination: 'Bedok Int',
    arrivingInMin: 5,
    occupancy: 'Med',
    wheelchairAccessible: true,
  },
  {
    serviceNo: '175',
    destination: 'Lor 1 Geylang Ter',
    arrivingInMin: 12,
    occupancy: 'High',
    wheelchairAccessible: true,
  },
  {
    serviceNo: '5',
    destination: 'Pasir Ris Int',
    arrivingInMin: 15,
    occupancy: 'Low',
    wheelchairAccessible: false,
  },
];

export const OD_FLOWS: OdFlowItem[] = [
  {
    origin: 'Orchard Rd',
    destination: 'Tampines',
    percentage: 34,
    avgTravelTime: '42 mins',
    passengersPerHour: 3420,
  },
  {
    origin: 'Orchard Rd',
    destination: 'Bedok',
    percentage: 28,
    avgTravelTime: '36 mins',
    passengersPerHour: 2810,
  },
  {
    origin: 'Orchard Rd',
    destination: 'Clementi',
    percentage: 15,
    avgTravelTime: '24 mins',
    passengersPerHour: 1540,
  },
];

export const MRT_LINE_STATUSES: MrtLineStatus[] = [
  {
    code: 'NSL',
    name: 'North South Line',
    status: 'Good Service',
    detail: 'Trains running at 2-3 min intervals',
    color: '#D42E12',
    badgeTextColor: '#FFFFFF',
  },
  {
    code: 'EWL',
    name: 'East West Line',
    status: 'Good Service',
    detail: 'Normal peak hour operating capacity',
    color: '#009530',
    badgeTextColor: '#FFFFFF',
  },
  {
    code: 'NEL',
    name: 'North East Line',
    status: 'Delays',
    detail: '5 min delay (Serangoon)',
    color: '#74007A',
    badgeTextColor: '#FFFFFF',
    delaysMin: 5,
  },
  {
    code: 'CCL',
    name: 'Circle Line',
    status: 'Good Service',
    detail: 'Good service across all sectors',
    color: '#FF9A00',
    badgeTextColor: '#FFFFFF',
  },
  {
    code: 'DTL',
    name: 'Downtown Line',
    status: 'Good Service',
    detail: 'Normal operation, recommended alternative',
    color: '#005EC4',
    badgeTextColor: '#FFFFFF',
  },
  {
    code: 'TEL',
    name: 'Thomson-East Coast',
    status: 'Good Service',
    detail: 'All stations open and operational',
    color: '#733510',
    badgeTextColor: '#FFFFFF',
  },
];

export const DHOBY_GHAUT_HOURLY_FORECAST: CrowdForecastPoint[] = [
  { time: '08:00', densityPercent: 40, label: 'Moderate' },
  { time: '09:00', densityPercent: 85, label: 'Peak', isCurrent: true },
  { time: '10:00', densityPercent: 60, label: 'Moderate' },
  { time: '11:00', densityPercent: 30, label: 'Low' },
  { time: '12:00', densityPercent: 20, label: 'Low' },
];

export const DHOBY_GHAUT_FULL_DAY_FORECAST: CrowdForecastPoint[] = [
  { time: '06:00', densityPercent: 15, label: 'Low' },
  { time: '07:00', densityPercent: 45, label: 'Moderate' },
  { time: '08:00', densityPercent: 78, label: 'Peak' },
  { time: '09:00', densityPercent: 85, label: 'Peak', isCurrent: true },
  { time: '10:00', densityPercent: 60, label: 'Moderate' },
  { time: '11:00', densityPercent: 30, label: 'Low' },
  { time: '12:00', densityPercent: 40, label: 'Moderate' },
  { time: '13:00', densityPercent: 35, label: 'Low' },
  { time: '14:00', densityPercent: 25, label: 'Low' },
  { time: '15:00', densityPercent: 30, label: 'Low' },
  { time: '16:00', densityPercent: 50, label: 'Moderate' },
  { time: '17:00', densityPercent: 75, label: 'Peak' },
  { time: '18:00', densityPercent: 90, label: 'Peak' },
  { time: '19:00', densityPercent: 80, label: 'Peak' },
  { time: '20:00', densityPercent: 45, label: 'Moderate' },
  { time: '21:00', densityPercent: 25, label: 'Low' },
];

export const HOURLY_WEATHER: WeatherHourly[] = [
  {
    time: '08:00',
    temp: 28,
    condition: 'Thunderstorm',
    rainChance: 80,
    icon: 'thunderstorm',
  },
  {
    time: '09:00',
    temp: 29,
    condition: 'Heavy Rain',
    rainChance: 60,
    icon: 'rainy',
  },
  {
    time: '10:00',
    temp: 30,
    condition: 'Partly Cloudy',
    rainChance: 30,
    icon: 'partly_cloudy_day',
  },
  {
    time: '11:00',
    temp: 31,
    condition: 'Cloudy',
    rainChance: 10,
    icon: 'cloud',
  },
  {
    time: '12:00',
    temp: 32,
    condition: 'Clear',
    rainChance: 5,
    icon: 'clear_day',
  },
  {
    time: '13:00',
    temp: 33,
    condition: 'Sunny',
    rainChance: 0,
    icon: 'clear_day',
  },
];
