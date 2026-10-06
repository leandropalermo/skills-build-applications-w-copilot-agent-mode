import { model, Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['run', 'ride', 'strength', 'yoga', 'walk'], required: true },
    durationMinutes: { type: Number, min: 1, required: true },
    caloriesBurned: { type: Number, min: 0, required: true },
    completedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export default model('Activity', activitySchema);