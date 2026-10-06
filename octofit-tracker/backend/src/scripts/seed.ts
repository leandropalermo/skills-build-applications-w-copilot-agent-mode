import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import { connectDatabase } from '../config/database.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    await Promise.all([
      Leaderboard.deleteMany({}),
      Activity.deleteMany({}),
      Workout.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
    ]);

    const paceMakers = await Team.create({
      name: 'Pace Makers',
      description: 'Consistent runners building endurance together.',
      members: [],
      totalPoints: 0,
    });
    const ironCircle = await Team.create({
      name: 'Iron Circle',
      description: 'Strength training with steady progress.',
      members: [],
      totalPoints: 0,
    });

    const users = await User.insertMany([
      {
        username: 'maya.moves',
        name: 'Maya Chen',
        email: 'maya@example.com',
        team: paceMakers._id,
        totalPoints: 420,
      },
      {
        username: 'leo.runs',
        name: 'Leo Martins',
        email: 'leo@example.com',
        team: paceMakers._id,
        totalPoints: 365,
      },
      {
        username: 'amara.lifts',
        name: 'Amara Okafor',
        email: 'amara@example.com',
        team: ironCircle._id,
        totalPoints: 390,
      },
      {
        username: 'noah.trains',
        name: 'Noah Silva',
        email: 'noah@example.com',
        team: ironCircle._id,
        totalPoints: 310,
      },
    ]);

    await Promise.all([
      Team.updateOne(
        { _id: paceMakers._id },
        { $set: { members: [users[0]._id, users[1]._id], totalPoints: 785 } },
      ),
      Team.updateOne(
        { _id: ironCircle._id },
        { $set: { members: [users[2]._id, users[3]._id], totalPoints: 700 } },
      ),
    ]);

    await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'run',
        durationMinutes: 38,
        caloriesBurned: 325,
        completedAt: new Date('2026-10-04T08:15:00Z'),
      },
      {
        user: users[1]._id,
        type: 'ride',
        durationMinutes: 52,
        caloriesBurned: 410,
        completedAt: new Date('2026-10-03T07:30:00Z'),
      },
      {
        user: users[2]._id,
        type: 'strength',
        durationMinutes: 45,
        caloriesBurned: 290,
        completedAt: new Date('2026-10-04T17:00:00Z'),
      },
      {
        user: users[3]._id,
        type: 'walk',
        durationMinutes: 30,
        caloriesBurned: 145,
        completedAt: new Date('2026-10-02T18:20:00Z'),
      },
    ]);

    await Leaderboard.insertMany([
      { user: users[0]._id, team: paceMakers._id, period: 'weekly', points: 180, rank: 1 },
      { user: users[2]._id, team: ironCircle._id, period: 'weekly', points: 165, rank: 2 },
      { user: users[1]._id, team: paceMakers._id, period: 'weekly', points: 140, rank: 3 },
      { user: users[3]._id, team: ironCircle._id, period: 'weekly', points: 125, rank: 4 },
    ]);

    await Workout.insertMany([
      {
        name: 'Easy Endurance Run',
        description: 'A conversational-pace session to build aerobic capacity.',
        level: 'beginner',
        focus: 'cardio',
        durationMinutes: 30,
        exercises: [{ name: 'Steady run', durationMinutes: 25 }, { name: 'Cool-down walk', durationMinutes: 5 }],
      },
      {
        name: 'Full-Body Strength',
        description: 'A balanced strength session with controlled repetitions.',
        level: 'intermediate',
        focus: 'strength',
        durationMinutes: 40,
        exercises: [
          { name: 'Goblet squat', sets: 3, reps: 10 },
          { name: 'Dumbbell row', sets: 3, reps: 10 },
          { name: 'Incline push-up', sets: 3, reps: 8 },
        ],
      },
      {
        name: 'Recovery Mobility',
        description: 'Gentle mobility work for hips, shoulders, and spine.',
        level: 'beginner',
        focus: 'mobility',
        durationMinutes: 20,
        exercises: [{ name: 'Hip mobility flow', durationMinutes: 8 }, { name: 'Shoulder mobility flow', durationMinutes: 7 }],
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
