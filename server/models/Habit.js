import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Health',
        'Fitness',
        'Study',
        'Work',
        'Personal',
        'Finance',
        'Reading',
        'Coding',
        'Sleep',
        'Other',
      ],
      default: 'Personal',
      index: true,
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    frequency: {
      type: String,
      enum: ['daily', 'specific_days', 'weekly', 'monthly'],
      default: 'daily',
    },
    targetDays: {
      type: [Number], // 0 = Sun, 1 = Mon, ..., 6 = Sat
      default: [0, 1, 2, 3, 4, 5, 6],
    },
    targetCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    unit: {
      type: String,
      default: 'time',
    },
    reminderTime: {
      type: String,
      default: '',
    },
    isReminderEnabled: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: String, // Stored as YYYY-MM-DD for timezone resilience
      default: () => new Date().toISOString().split('T')[0],
    },
    endDate: {
      type: String,
      default: null,
    },
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

habitSchema.index({ userId: 1, archived: 1 });

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;
