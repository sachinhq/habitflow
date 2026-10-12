import mongoose from 'mongoose';

const studyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      index: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
    chapterId: {
      type: String,
      default: '',
    },
    chapterName: {
      type: String,
      default: '',
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    questionsSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    topicCovered: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

studyLogSchema.index({ userId: 1, date: 1 });

const StudyLog = mongoose.model('StudyLog', studyLogSchema);
export default StudyLog;
