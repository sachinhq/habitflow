import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    badgeId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'Award',
    },
    category: {
      type: String,
      default: 'General',
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
