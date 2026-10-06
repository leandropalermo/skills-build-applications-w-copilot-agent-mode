import express, { type Request, type Response } from 'express';
import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';
import { connectDatabase } from './config/database.js';

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/users/', async (_request: Request, response: Response) => {
  response.json(await User.find().populate('team', 'name').sort({ name: 1 }));
});
app.get('/api/teams/', async (_request: Request, response: Response) => {
  response.json(await Team.find().populate('members', 'username name').sort({ name: 1 }));
});
app.get('/api/activities/', async (_request: Request, response: Response) => {
  response.json(await Activity.find().populate('user', 'username name').sort({ completedAt: -1 }));
});
app.get('/api/leaderboard/', async (_request: Request, response: Response) => {
  response.json(
    await Leaderboard.find()
      .populate('user', 'username name')
      .populate('team', 'name')
      .sort({ period: 1, rank: 1 }),
  );
});
app.get('/api/workouts/', async (_request: Request, response: Response) => {
  response.json(await Workout.find().sort({ name: 1 }));
});

void connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`OctoFit API listening at ${baseUrl}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Unable to start the API without MongoDB:', error);
    process.exitCode = 1;
  });
