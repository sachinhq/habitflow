import mongoose from 'mongoose';

const checkpointItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['learn', 'practice', 'pyq', 'revision', 'test', 'custom'],
    default: 'custom',
  },
  weight: {
    type: Number,
    default: 5,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  target: {
    type: String,
    default: '',
  },
  deadline: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
});

const userChapterProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    examId: {
      type: String,
      default: 'ssc_cgl',
      index: true,
    },
    subjectId: {
      type: String,
      required: true,
      index: true,
    },
    chapterId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['not_started', 'learning', 'practicing', 'revision', 'completed', 'mastered'],
      default: 'not_started',
      index: true,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    theoryDone: {
      type: Boolean,
      default: false,
    },
    examplesDone: {
      type: Boolean,
      default: false,
    },
    practiceSolved: {
      type: Number,
      default: 0,
    },
    practiceTarget: {
      type: Number,
      default: 100,
    },
    pyqsSolved: {
      type: Number,
      default: 0,
    },
    pyqsTarget: {
      type: Number,
      default: 50,
    },
    revisionCount: {
      type: Number,
      default: 0,
    },
    mockQuestionsSolved: {
      type: Number,
      default: 0,
    },
    mockQuestionsTarget: {
      type: Number,
      default: 50,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    lastStudiedAt: {
      type: Date,
      default: null,
    },
    checkpoints: [checkpointItemSchema],
  },
  {
    timestamps: true,
  }
);

userChapterProgressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });
userChapterProgressSchema.index({ userId: 1, subjectId: 1 });

const UserChapterProgress = mongoose.model('UserChapterProgress', userChapterProgressSchema);
export default UserChapterProgress;
