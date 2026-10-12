import React from 'react';
import {
  Sparkles,
  Flame,
  Droplets,
  BookOpen,
  Code,
  Footprints,
  Dumbbell,
  Heart,
  Moon,
  Sun,
  Coffee,
  Brain,
  Laptop,
  GraduationCap,
  DollarSign,
  Target,
  Zap,
  Smile,
  Music,
  Apple,
  Pill,
  Award,
  Trophy,
  Compass,
  CheckCircle2,
  Calendar,
  Clock,
  Activity,
  Layers,
  Star,
} from 'lucide-react';

export const ICONS_LIST = [
  { name: 'Sparkles', icon: Sparkles, label: 'Sparkles' },
  { name: 'Flame', icon: Flame, label: 'Flame' },
  { name: 'Droplets', icon: Droplets, label: 'Water' },
  { name: 'BookOpen', icon: BookOpen, label: 'Reading' },
  { name: 'Code', icon: Code, label: 'Coding' },
  { name: 'Footprints', icon: Footprints, label: 'Walking' },
  { name: 'Dumbbell', icon: Dumbbell, label: 'Workout' },
  { name: 'Heart', icon: Heart, label: 'Health' },
  { name: 'Moon', icon: Moon, label: 'Sleep' },
  { name: 'Sun', icon: Sun, label: 'Morning' },
  { name: 'Coffee', icon: Coffee, label: 'Coffee/Routine' },
  { name: 'Brain', icon: Brain, label: 'Focus' },
  { name: 'Laptop', icon: Laptop, label: 'Work' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Study' },
  { name: 'DollarSign', icon: DollarSign, label: 'Finance' },
  { name: 'Target', icon: Target, label: 'Goal' },
  { name: 'Zap', icon: Zap, label: 'Energy' },
  { name: 'Smile', icon: Smile, label: 'Mindset' },
  { name: 'Music', icon: Music, label: 'Creative' },
  { name: 'Apple', icon: Apple, label: 'Nutrition' },
  { name: 'Award', icon: Award, label: 'Milestone' },
  { name: 'Trophy', icon: Trophy, label: 'Achievement' },
];

export const getIconComponent = (iconName, props = {}) => {
  const item = ICONS_LIST.find((i) => i.name === iconName);
  const IconComponent = item ? item.icon : Sparkles;
  return <IconComponent {...props} />;
};
