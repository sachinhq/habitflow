import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weight: {
      type: Number,
      required: [true, 'Weight value is required'],
      min: [10, 'Weight must be at least 10'],
      max: [500, 'Weight must be less than 500'],
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg',
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Date is required'],
      index: true,
    },
    weekLabel: {
      type: String,
      default: '',
    },
    bodyFat: {
      type: Number,
      min: [2, 'Body fat must be at least 2%'],
      max: [70, 'Body fat must be under 70%'],
      default: null,
    },
    waistCm: {
      type: Number,
      min: [30, 'Waist must be at least 30 cm'],
      max: [200, 'Waist must be under 200 cm'],
      default: null,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one weight entry per date (upsert friendly)
weightLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const WeightLog = mongoose.model('WeightLog', weightLogSchema);
export default WeightLog;
