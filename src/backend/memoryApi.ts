import express, { Request, Response } from 'express';
import { getMemoryData } from './memoryDatabase';

const app = express();
const port = 3001;

app.get('/api/memory', async (req: Request, res: Response) => {
  try {
    const data = await getMemoryData();
    res.json({ success: true, data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Unknown error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Memory API server running at http://localhost:${port}`);
});