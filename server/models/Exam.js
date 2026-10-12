import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    examId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'SSC',
      index: true,
    },
    targetDate: {
      type: String, // 'YYYY-MM-DD'
      default: '',
    },
    stages: {
      type: String,
      default: '',
    },
    totalMarks: {
      type: Number,
      default: 200,
    },
    totalQuestions: {
      type: Number,
      default: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
