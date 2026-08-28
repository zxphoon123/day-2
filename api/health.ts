import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'SG Commuter Portal API (Vercel Serverless)',
    endpoints: {
      weather: '/api/weather/summary',
      transport: '/api/transport/taxi-availability',
      ltaBus: '/api/lta/bus-arrival',
      ltaAlerts: '/api/lta/train-alerts',
      smartAdvisory: '/api/commute/smart-advisory',
      motivation: '/api/punctual/motivate',
    },
  });
}
