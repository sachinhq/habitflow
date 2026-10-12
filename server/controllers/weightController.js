import WeightLog from '../models/WeightLog.js';
import User from '../models/User.js';
import { addXpToUser } from '../services/gamificationService.js';

// Safe parse optional numeric fields
const parseOptionalNumber = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

// Normalize date string to YYYY-MM-DD
const normalizeDateString = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      if (parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      }
    }
  }
  return dateStr;
};

// Format date nicely e.g. "Oct 12, 2026"
const formatDateLabel = (dateStr) => {
  if (!dateStr) return '';
  const normalized = normalizeDateString(dateStr);
  const parts = normalized.split('-');
  if (parts.length < 3) return dateStr;
  const [year, month, day] = parts;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[parseInt(month, 10) - 1] || month;
  return `${monthName} ${parseInt(day, 10)}, ${year}`;
};

// Calculate BMI and category
const calculateBmi = (weight, unit, heightCm) => {
  if (!weight || !heightCm || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const weightKg = unit === 'lbs' ? weight * 0.45359237 : weight;
  const bmiVal = +(weightKg / (heightM * heightM)).toFixed(1);

  let category = 'Normal';
  let color = 'text-emerald-500';
  if (bmiVal < 18.5) {
    category = 'Underweight';
    color = 'text-amber-500';
  } else if (bmiVal >= 25 && bmiVal < 30) {
    category = 'Overweight';
    color = 'text-amber-500';
  } else if (bmiVal >= 30) {
    category = 'Obese';
    color = 'text-rose-500';
  }

  return { value: bmiVal, category, color };
};

// @desc    Get all weight logs and computed statistics
// @route   GET /api/weight
// @access  Private
export const getWeightData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const preferences = user.preferences || {};
    const targetWeight = preferences.targetWeight || null;
    const heightCm = preferences.heightCm || null;
    const preferredUnit = preferences.weightUnit || 'kg';

    // Retrieve all logs sorted chronologically ascending
    const rawLogs = await WeightLog.find({ userId: req.user.id }).sort({ date: 1 });

    const totalLogsCount = rawLogs.length;

    // Build chronological chart data
    const chartData = rawLogs.map((log) => ({
      id: log._id,
      date: log.date,
      formattedDate: formatDateLabel(log.date),
      weight: log.weight,
      unit: log.unit,
      targetWeight: targetWeight,
      bodyFat: log.bodyFat,
      waistCm: log.waistCm,
      notes: log.notes,
    }));

    // Build enriched descending logs with weekly change diffs
    const logsWithDiff = [];
    for (let i = rawLogs.length - 1; i >= 0; i--) {
      const current = rawLogs[i];
      const prev = i > 0 ? rawLogs[i - 1] : null;
      const diff = prev ? +(current.weight - prev.weight).toFixed(1) : 0;

      logsWithDiff.push({
        ...current.toObject(),
        formattedDate: formatDateLabel(current.date),
        changeFromPrev: diff,
      });
    }

    // Compute key metrics
    let currentWeight = null;
    let previousWeight = null;
    let weeklyChange = 0;
    let startingWeight = preferences.startingWeight || (rawLogs.length > 0 ? rawLogs[0].weight : null);
    let totalChange = 0;
    let lowestWeight = null;
    let highestWeight = null;
    let averageWeight = null;
    let targetProgress = 0;
    let remainingToTarget = null;

    if (totalLogsCount > 0) {
      currentWeight = rawLogs[totalLogsCount - 1].weight;
      if (totalLogsCount > 1) {
        previousWeight = rawLogs[totalLogsCount - 2].weight;
        weeklyChange = +(currentWeight - previousWeight).toFixed(1);
      }

      if (startingWeight) {
        totalChange = +(currentWeight - startingWeight).toFixed(1);
      } else {
        startingWeight = rawLogs[0].weight;
        totalChange = +(currentWeight - startingWeight).toFixed(1);
      }

      const weightValues = rawLogs.map((l) => l.weight);
      lowestWeight = Math.min(...weightValues);
      highestWeight = Math.max(...weightValues);
      const sum = weightValues.reduce((acc, v) => acc + v, 0);
      averageWeight = +(sum / weightValues.length).toFixed(1);

      // Target progress calculation
      if (targetWeight && startingWeight) {
        remainingToTarget = +(currentWeight - targetWeight).toFixed(1);
        if (startingWeight === targetWeight) {
          targetProgress = 100;
        } else if (startingWeight > targetWeight) {
          // Weight loss goal
          if (currentWeight <= targetWeight) {
            targetProgress = 100;
          } else if (currentWeight >= startingWeight) {
            targetProgress = 0;
          } else {
            targetProgress = Math.min(
              100,
              Math.max(0, Math.round(((startingWeight - currentWeight) / (startingWeight - targetWeight)) * 100))
            );
          }
        } else {
          // Weight gain / bulk goal
          if (currentWeight >= targetWeight) {
            targetProgress = 100;
          } else if (currentWeight <= startingWeight) {
            targetProgress = 0;
          } else {
            targetProgress = Math.min(
              100,
              Math.max(0, Math.round(((currentWeight - startingWeight) / (targetWeight - startingWeight)) * 100))
            );
          }
        }
      }
    }

    const bmi = calculateBmi(currentWeight, preferredUnit, heightCm);

    res.status(200).json({
      success: true,
      data: {
        logs: logsWithDiff,
        chartData,
        stats: {
          currentWeight,
          previousWeight,
          weeklyChange,
          startingWeight,
          totalChange,
          lowestWeight,
          highestWeight,
          averageWeight,
          targetWeight,
          remainingToTarget,
          targetProgress,
          bmi,
          preferredUnit,
          totalEntries: totalLogsCount,
        },
        preferences: {
          targetWeight,
          startingWeight,
          heightCm,
          weightUnit: preferredUnit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log or update weekly/daily weight
// @route   POST /api/weight
// @access  Private
export const logWeight = async (req, res, next) => {
  try {
    const { weight, date, unit, bodyFat, waistCm, notes } = req.body;

    if (!weight || !date) {
      return res.status(400).json({
        success: false,
        message: 'Weight and date are required',
      });
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid weight number',
      });
    }

    const preferredUnit = unit || 'kg';
    const normalizedDate = normalizeDateString(date);

    const parsedBodyFat = parseOptionalNumber(bodyFat);
    const parsedWaistCm = parseOptionalNumber(waistCm);

    // Upsert weight entry for this user and date
    const updatedLog = await WeightLog.findOneAndUpdate(
      { userId: req.user.id, date: normalizedDate },
      {
        userId: req.user.id,
        weight: weightNum,
        unit: preferredUnit,
        date: normalizedDate,
        bodyFat: parsedBodyFat,
        waistCm: parsedWaistCm,
        notes: notes || '',
      },
      { new: true, upsert: true, runValidators: true }
    );

    // If user starting weight is not set, set it to this first log
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        if (!user.preferences) user.preferences = {};
        if (!user.preferences.startingWeight) {
          user.preferences.startingWeight = weightNum;
          await user.save();
        }
      }
      // Award +15 XP for consistent weigh-in tracking
      await addXpToUser(req.user.id, 15);
    } catch (userErr) {
      console.warn('Could not update user starting weight/XP:', userErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Weight logged successfully!',
      data: updatedLog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a weight entry
// @route   DELETE /api/weight/:id
// @access  Private
export const deleteWeightLog = async (req, res, next) => {
  try {
    const log = await WeightLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!log) {
      return res.status(404).json({ success: false, message: 'Weight entry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Weight entry deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update weight preferences (Target, Starting, Height, Unit)
// @route   PUT /api/weight/preferences
// @access  Private
export const updateWeightPreferences = async (req, res, next) => {
  try {
    const { targetWeight, startingWeight, heightCm, weightUnit } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.preferences) {
      user.preferences = {};
    }

    if (targetWeight !== undefined) {
      user.preferences.targetWeight = parseOptionalNumber(targetWeight);
    }
    if (startingWeight !== undefined) {
      user.preferences.startingWeight = parseOptionalNumber(startingWeight);
    }
    if (heightCm !== undefined) {
      user.preferences.heightCm = parseOptionalNumber(heightCm);
    }
    if (weightUnit && ['kg', 'lbs'].includes(weightUnit)) {
      user.preferences.weightUnit = weightUnit;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Weight preferences updated',
      data: user.preferences,
    });
  } catch (error) {
    next(error);
  }
};
