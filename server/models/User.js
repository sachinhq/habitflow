import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      soundEnabled: {
        type: Boolean,
        default: true,
      },
      weeklyReport: {
        type: Boolean,
        default: true,
      },
      targetExam: {
        type: String,
        default: 'ssc_cgl',
      },
      targetExamDate: {
        type: String,
        default: '2026-09-15',
      },
      dailyStudyHoursGoal: {
        type: Number,
        default: 4,
      },
      targetWeight: {
        type: Number,
        default: null,
      },
      startingWeight: {
        type: Number,
        default: null,
      },
      heightCm: {
        type: Number,
        default: null,
      },
      weightUnit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg',
      },
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Recalculate level based on XP
userSchema.methods.updateLevel = function () {
  // Simple progressive curve: Level = 1 + floor(sqrt(xp / 50))
  const newLevel = Math.max(1, Math.floor(Math.sqrt(this.xp / 50)) + 1);
  this.level = newLevel;
  return newLevel;
};

const User = mongoose.model('User', userSchema);
export default User;
