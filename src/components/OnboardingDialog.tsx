import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface OnboardingDialogProps {
  onSelectDialect: (dialect: 'Egyptian' | 'Levantine') => void;
}

export function OnboardingDialog({ onSelectDialect }: OnboardingDialogProps) {
  const [selected, setSelected] = useState<'Egyptian' | 'Levantine' | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelectDialect(selected);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50 p-4">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full blur-3xl opacity-50 -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200 to-indigo-300 rounded-full blur-3xl opacity-50 -ml-16 -mb-16" />
        
        <div className="relative">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl mb-4 inline-block"
            >
              ✨
            </motion.div>
            <h1 className="text-4xl mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">مرحباً</h1>
            <h2 className="text-2xl mb-3">Welcome to World Peas!</h2>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Choose your Arabic adventure</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </p>
          </motion.div>

          <div className="space-y-4 mb-8">
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected('Egyptian')}
              className={`w-full p-5 rounded-2xl border-3 transition-all text-left relative overflow-hidden ${
                selected === 'Egyptian'
                  ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg shadow-amber-200'
                  : 'border-gray-200 hover:border-amber-300 bg-white'
              }`}
            >
              {selected === 'Egyptian' && (
                <motion.div
                  layoutId="selected-bg"
                  className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.span 
                      className="text-3xl"
                      animate={selected === 'Egyptian' ? { rotate: [0, -10, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      🇪🇬
                    </motion.span>
                    <h3 className="text-xl">Egyptian Arabic</h3>
                  </div>
                  <p className="text-sm text-gray-600">المصرية • Most widely understood</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">🏺 Ancient culture</span>
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">☀️ Warm & friendly</span>
                  </div>
                </div>
                <AnimatePresence>
                  {selected === 'Egyptian' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>

            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected('Levantine')}
              className={`w-full p-5 rounded-2xl border-3 transition-all text-left relative overflow-hidden ${
                selected === 'Levantine'
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-200'
                  : 'border-gray-200 hover:border-indigo-300 bg-white'
              }`}
            >
              {selected === 'Levantine' && (
                <motion.div
                  layoutId="selected-bg"
                  className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-purple-100/50"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.span 
                      className="text-3xl"
                      animate={selected === 'Levantine' ? { rotate: [0, -10, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      🇯🇴
                    </motion.span>
                    <h3 className="text-xl">Levantine Arabic</h3>
                  </div>
                  <p className="text-sm text-gray-600">الشامية • Syria, Lebanon, Jordan, Palestine</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">🌊 Mediterranean</span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">🎨 Rich heritage</span>
                  </div>
                </div>
                <AnimatePresence>
                  {selected === 'Levantine' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: selected ? 1.02 : 1 }}
            whileTap={{ scale: selected ? 0.98 : 1 }}
            onClick={handleContinue}
            disabled={!selected}
            className={`w-full py-4 rounded-2xl transition-all shadow-lg ${
              selected
                ? selected === 'Egyptian'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-xl hover:shadow-amber-300'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-300'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-lg">Start Learning</span>
              <motion.span
                animate={selected ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-gray-500 text-center mt-4"
          >
            You can change this anytime in Settings ⚙️
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
