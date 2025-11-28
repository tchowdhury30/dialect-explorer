import { motion } from 'motion/react';
import { Category } from '../types';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  phraseCount: number;
  onClick: () => void;
  currentDialect: 'Egyptian' | 'Levantine';
}

export function CategoryCard({ category, phraseCount, onClick, currentDialect }: CategoryCardProps) {
  const dialectColors = {
    Egyptian: {
      border: 'hover:border-amber-500',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      badge: 'bg-amber-100 text-amber-700',
    },
    Levantine: {
      border: 'hover:border-indigo-500',
      bg: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      badge: 'bg-indigo-100 text-indigo-700',
    },
  };

  const colors = dialectColors[currentDialect];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full bg-white rounded-xl p-5 shadow-sm border-2 border-gray-200 ${colors.border} hover:shadow-lg transition-all text-left relative overflow-hidden group`}
    >
      {/* Animated background on hover */}
      <motion.div
        className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity`}
        initial={{ opacity: 0 }}
      />
      
      <div className="relative flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-4xl"
        >
          {category.icon}
        </motion.div>
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{category.name}</h3>
          <p className="text-gray-500 text-sm">{category.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`${colors.badge} px-3 py-1 rounded-full`}>
            {phraseCount}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.button>
  );
}
