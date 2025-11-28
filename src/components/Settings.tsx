import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Download, Trash2, Globe, Heart, DollarSign, Mic, User, ChevronLeft, Sparkles } from 'lucide-react';

type DialectType = 'Egyptian' | 'Levantine';

interface SettingsProps {
  currentDialect: DialectType;
  downloadedDialects: DialectType[];
  onDialectChange: (dialect: DialectType) => void;
  onDownloadDialect: (dialect: DialectType) => void;
  onDeleteDialect: (dialect: DialectType) => void;
  onClose: () => void;
}

export function Settings({
  currentDialect,
  downloadedDialects,
  onDialectChange,
  onDownloadDialect,
  onDeleteDialect,
  onClose,
}: SettingsProps) {
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  const dialectInfo: Record<DialectType, { flag: string; name: string; size: string; color: string; bgGradient: string }> = {
    Egyptian: { 
      flag: '🇪🇬', 
      name: 'Egyptian Arabic', 
      size: '~25 MB',
      color: 'text-amber-600',
      bgGradient: 'from-amber-500 to-orange-600',
    },
    Levantine: { 
      flag: '🇯🇴', 
      name: 'Levantine Arabic', 
      size: '~25 MB',
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-500 to-purple-600',
    },
  };

  const isDownloaded = (dialect: DialectType) => downloadedDialects.includes(dialect);
  const isOnline = navigator.onLine;

  if (showDownloadSection) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-gradient-to-r ${dialectInfo[currentDialect].bgGradient} text-white p-6 shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDownloadSection(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h2 className="text-2xl">Offline Downloads</h2>
              <p className="text-white/80 text-sm">Manage your dialect packages</p>
            </div>
          </div>
          {!isOnline && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl text-sm"
            >
              📶 You're currently offline. Connect to internet to download dialects.
            </motion.div>
          )}
        </motion.div>

        {/* Download Options */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 text-sm mb-6 bg-white p-4 rounded-xl shadow-sm"
            >
              💾 Download dialect audio and content for offline use. Each dialect includes all phrases with native speaker pronunciation.
            </motion.p>

            {(Object.keys(dialectInfo) as DialectType[]).map((dialect, index) => {
              const info = dialectInfo[dialect];
              const downloaded = isDownloaded(dialect);

              return (
                <motion.div
                  key={dialect}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <motion.span 
                        className="text-4xl"
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        {info.flag}
                      </motion.span>
                      <div>
                        <h3 className="text-xl mb-1">{info.name}</h3>
                        <p className="text-sm text-gray-500">{info.size}</p>
                      </div>
                    </div>
                    {downloaded && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-xs px-3 py-1 bg-gradient-to-r ${info.bgGradient} text-white rounded-full flex items-center gap-1 shadow-md`}
                      >
                        <Sparkles className="w-3 h-3" />
                        Downloaded
                      </motion.span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {!downloaded ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onDownloadDialect(dialect)}
                        disabled={!isOnline}
                        className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                          isOnline
                            ? `bg-gradient-to-r ${info.bgGradient} text-white hover:shadow-lg`
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Download className="w-5 h-5" />
                        <span>Download</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onDeleteDialect(dialect)}
                        className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>Delete</span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentInfo = dialectInfo[currentDialect];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`bg-gradient-to-r ${currentInfo.bgGradient} text-white p-6 shadow-lg`}
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: -90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h2 className="text-2xl">Settings</h2>
            <p className="text-white/80 text-sm">Customize your experience</p>
          </div>
        </div>
      </motion.div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Current Dialect */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-md mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className={currentInfo.color} />
            <h3 className="text-lg">Current Dialect</h3>
          </div>
          <div className="space-y-3">
            {(Object.keys(dialectInfo) as DialectType[]).map((dialect) => {
              const info = dialectInfo[dialect];
              return (
                <motion.button
                  key={dialect}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDialectChange(dialect)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    currentDialect === dialect
                      ? `border-transparent bg-gradient-to-br ${info.bgGradient} text-white shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.flag}</span>
                    <span>{info.name}</span>
                  </div>
                  <AnimatePresence>
                    {currentDialect === dialect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Offline Downloads */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden"
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowDownloadSection(true)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${currentInfo.bgGradient} rounded-xl flex items-center justify-center shadow-md`}>
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg">Offline Downloads</h3>
                <p className="text-sm text-gray-500">
                  {downloadedDialects.length} dialect{downloadedDialects.length !== 1 ? 's' : ''} downloaded
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>
        </motion.div>

        {/* Future Features */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500 px-2 mb-3">Coming Soon ✨</p>
          {[
            { icon: User, title: 'Profile', desc: 'Customize your learning profile', color: 'from-blue-400 to-blue-600' },
            { icon: Globe, title: 'Preferred Language', desc: 'Change app language', color: 'from-green-400 to-green-600' },
            { icon: Heart, title: 'Support & Donate', desc: 'Help keep World Peas free', color: 'from-pink-400 to-pink-600' },
            { icon: Mic, title: 'Voice Attribution', desc: 'Credits for audio recordings', color: 'from-purple-400 to-purple-600' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-white/50 rounded-xl p-4 flex items-center gap-4 opacity-60"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* App Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 text-center text-sm text-gray-500"
        >
          <p>World Peas v1.0.0</p>
          <p className="mt-1">Arabic Survival Guide for Travelers ✈️</p>
        </motion.div>
      </div>
    </div>
  );
}
