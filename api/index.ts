import app from './app.js';

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (error: any) {
    console.error('Serverless error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || 'Server error' });
    }
  }
}
