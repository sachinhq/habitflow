import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import { BADGE_DEFINITIONS } from '../services/gamificationService.js';
import { seedUserData } from '../utils/seedData.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & preferences
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, preferences } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all achievements with unlocked status
// @route   GET /api/users/achievements
// @access  Private
export const getAchievements = async (req, res, next) => {
  try {
    const userAchievements = await Achievement.find({ userId: req.user.id });
    const unlockedMap = new Map(userAchievements.map((a) => [a.badgeId, a.unlockedAt]));

    const badges = BADGE_DEFINITIONS.map((b) => {
      const isUnlocked = unlockedMap.has(b.badgeId);
      return {
        ...b,
        isUnlocked,
        unlockedAt: isUnlocked ? unlockedMap.get(b.badgeId) : null,
      };
    });

    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        xp: user.xp,
        level: user.level,
        nextLevelXp: Math.pow(user.level, 2) * 50,
        currentLevelBaseXp: Math.pow(user.level - 1, 2) * 50,
        unlockedCount: userAchievements.length,
        totalCount: BADGE_DEFINITIONS.length,
        badges,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed or reset user demo data
// @route   POST /api/users/seed-demo
// @access  Private
export const seedDemo = async (req, res, next) => {
  try {
    await seedUserData(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Demo habits and 60 days of historical data loaded successfully!',
    });
  } catch (error) {
    next(error);
  }
};
