export type ActiveTab = 'summary' | 'bus' | 'mrt' | 'weather';

export interface RouteOption {
  id: string;
  type: 'taxi' | 'mrt' | 'bus';
  name: string;
  subtext: string;
  durationMin: number;
  cost: number;
  surgeLevel?: 'High Surge' | 'Normal Crowd' | 'Moderate Traffic' | 'Low Traffic';
  statusColor?: string;
  isBest?: boolean;
  mrtLines?: string[];
  busNumber?: string;
}

export interface DepartureItem {
  id: string;
  stationName: string;
  lineCode: string;
  lineName: string;
  destination: string;
  eta: string;
  nextEta: string;
  color: string;
  textColor?: string;
  type: 'mrt' | 'bus';
}

export interface BusServiceItem {
  serviceNo: string;
  destination: string;
  arrivingInMin: number;
  occupancy: 'Low' | 'Med' | 'High';
  wheelchairAccessible?: boolean;
}

export interface OdFlowItem {
  origin: string;
  destination: string;
  percentage: number;
  avgTravelTime: string;
  passengersPerHour: number;
}

export interface MrtLineStatus {
  code: string;
  name: string;
  status: 'Good Service' | 'Delays' | 'Maintenance' | 'Crowded';
  detail: string;
  color: string;
  badgeTextColor: string;
  delaysMin?: number;
}

export interface CrowdForecastPoint {
  time: string;
  densityPercent: number;
  label: 'Low' | 'Moderate' | 'Peak' | 'High';
  isCurrent?: boolean;
}

export interface WeatherHourly {
  time: string;
  temp: number;
  condition: string;
  rainChance: number;
  icon: string;
}
