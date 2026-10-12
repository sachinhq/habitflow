import mongoose from 'mongoose';

const habitCompletionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
      index: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      index: true,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Number,
      default: 1,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate entries for the same habit and date per user
habitCompletionSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });
habitCompletionSchema.index({ userId: 1, date: 1 });

const HabitCompletion = mongoose.model('HabitCompletion', habitCompletionSchema);
export default HabitCompletion;
