import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronDown, ChevronUp, Heart, BookOpen } from 'lucide-react';

type DialectType = 'Egyptian' | 'Levantine';

interface CulturePost {
  id: string;
  title: string;
  content: string;
  image: string;
  dialect: DialectType;
  category: string;
}

const culturePosts: CulturePost[] = [
  {
    id: 'eg1',
    title: 'Egyptian Hospitality & Tea Culture',
    content: 'In Egypt, offering tea (شاي - "shai") is a fundamental part of hospitality. When visiting someone\'s home, expect to be offered tea multiple times. Refusing can be seen as impolite, so it\'s best to accept at least one cup. Egyptian tea is typically strong, sweet, and served in small glasses.',
    image: 'https://images.unsplash.com/photo-1629212093584-aad671e0619a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmFiaWMlMjB0ZWElMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjQzMjY4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'Egyptian',
    category: 'Food & Drink',
  },
  {
    id: 'eg2',
    title: 'Understanding "Inshallah" in Egyptian Culture',
    content: '"Inshallah" (إن شاء الله) literally means "God willing" and is used constantly in Egyptian conversation. While it can mean genuine hope that something will happen, it can also be a polite way of saying "probably not" or "maybe." Context and tone are key to understanding the real meaning.',
    image: 'https://images.unsplash.com/photo-1714078663708-f9c4271799e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMHN0cmVldCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2NDMyNjg5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'Egyptian',
    category: 'Language Tips',
  },
  {
    id: 'eg3',
    title: 'Egyptian Street Food Etiquette',
    content: 'Egyptian street food is incredible but comes with its own etiquette. When eating koshari (كشري), Egypt\'s national dish, add the hot sauce (شطة - "shatta") gradually - it\'s very spicy! Ta\'ameya (فلافل) is best eaten fresh and hot. Street vendors often give generous portions, so don\'t be shy about sharing.',
    image: 'https://images.unsplash.com/photo-1508972817144-6f62a84645c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYWlybyUyMEVneXB0JTIwbWFya2V0fGVufDF8fHx8MTc2NDMyNjE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'Egyptian',
    category: 'Food & Drink',
  },
  {
    id: 'eg4',
    title: 'Bargaining in Egyptian Markets',
    content: 'Bargaining is expected in Egyptian souqs and markets. Start at about 50% of the asking price and work your way up. The key phrase "khafeef shwaya" (خفف شوية) means "lower it a bit." Vendors respect good-natured haggling - it\'s part of the shopping experience, not an insult.',
    image: 'https://images.unsplash.com/photo-1749815362062-33911b27ef9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMG1pZGRsZSUyMGVhc3QlMjBwYXR0ZXJufGVufDF8fHx8MTc2NDMyNjg5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'Egyptian',
    category: 'Social Customs',
  },
  {
    id: 'lv1',
    title: 'Levantine Coffee Traditions',
    content: 'In the Levantine region, Arabic coffee (قهوة عربية - "ahwe arabiyye") is a symbol of hospitality and tradition. Served in small cups without handles, it\'s typically flavored with cardamom. The coffee ceremony involves three servings: the first for the guest, the second for enjoyment, and the third for digestion.',
    image: 'https://images.unsplash.com/photo-1629212093584-aad671e0619a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmFiaWMlMjB0ZWElMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjQzMjY4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'Levantine',
    category: 'Food & Drink',
  },
  {
    id: 'lv2',
    title: 'Greetings in Levantine Culture',
    content: 'Greetings in Levantine culture are elaborate and important. "Marhaba" (مرحبا) is a warm hello, but you\'ll often hear "Ahlan wa sahlan" (أهلاً وسهلاً) meaning "welcome." Handshakes are common among men, while women may kiss on both cheeks. Take time with greetings - rushing them is considered rude.',
    image: 'https://images.unsplash.com/photo-1733272967076-3a2ce81226e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGVycmFuZWFuJTIwY29hc3QlMjBzdW5zZXR8ZW58MXx8fHwxNzY0MzI2ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'Levantine',
    category: 'Social Customs',
  },
  {
    id: 'lv3',
    title: 'Understanding "Yalla" in Daily Life',
    content: '"Yalla" (يلا) is one of the most versatile words in Levantine Arabic. It can mean "let\'s go," "come on," "hurry up," or "okay, fine." You\'ll hear it constantly in Jordan, Syria, Lebanon, and Palestine. "Yalla bye" is a common friendly goodbye, while "yalla habibi" adds affection to any encouragement.',
    image: 'https://images.unsplash.com/photo-1575650693902-8ead804c0732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQZXRyYSUyMEpvcmRhbiUyMGFuY2llbnR8ZW58MXx8fHwxNzY0MzI2MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'Levantine',
    category: 'Language Tips',
  },
  {
    id: 'lv4',
    title: 'Levantine Mezze Culture',
    content: 'Mezze (مقبلات - "muqabilat") is central to Levantine dining. These small dishes - hummus, baba ganoush, tabbouleh, fattoush - are meant for sharing. Meals are social events, often lasting hours. Don\'t fill up on mezze too quickly; the main course comes later. Use pita bread to scoop, and eat with your right hand.',
    image: 'https://images.unsplash.com/photo-1619366545848-0d3b76ba523e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZXZhbnRpbmUlMjBmb29kJTIwY29sb3JmdWx8ZW58MXx8fHwxNzY0MzI2ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'Levantine',
    category: 'Food & Drink',
  },
];

interface CultureProps {
  currentDialect: 'Egyptian' | 'Levantine';
}

export function Culture({ currentDialect }: CultureProps) {
  const [selectedDialect, setSelectedDialect] = useState<DialectType | 'All'>('All');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('likedPosts');
    if (stored) {
      try {
        return new Set(JSON.parse(stored) as string[]);
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(Array.from(likedPosts)));
  }, [likedPosts]);

  const filteredPosts = selectedDialect === 'All' 
    ? culturePosts 
    : culturePosts.filter(post => post.dialect === selectedDialect);

  const dialectColors = {
    Egyptian: {
      active: 'bg-gradient-to-r from-amber-500 to-orange-600',
      inactive: 'bg-gray-100',
      badge: 'bg-amber-100 text-amber-700',
      categoryBadge: 'bg-orange-100 text-orange-700',
    },
    Levantine: {
      active: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      inactive: 'bg-gray-100',
      badge: 'bg-indigo-100 text-indigo-700',
      categoryBadge: 'bg-purple-100 text-purple-700',
    },
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg">Cultural Insights</h2>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDialect('All')}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedDialect === 'All'
                ? `${currentDialect === 'Egyptian' ? dialectColors.Egyptian.active : dialectColors.Levantine.active} text-white shadow-md`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Stories
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDialect('Egyptian')}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedDialect === 'Egyptian'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🇪🇬 Egyptian
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDialect('Levantine')}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedDialect === 'Levantine'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🇯🇴 Levantine
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence>
            {filteredPosts.map((post, index) => {
              const colors = dialectColors[post.dialect];
              const isLiked = likedPosts.has(post.id);
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="relative overflow-hidden group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-3 py-1 ${colors.categoryBadge} rounded-full`}>
                        {post.category}
                      </span>
                      <span className={`text-xs px-3 py-1 ${colors.badge} rounded-full`}>
                        {post.dialect === 'Egyptian' ? '🇪🇬 Egyptian' : '🇯🇴 Levantine'}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl">{post.title}</h3>
                    <motion.div 
                      className={`text-gray-700 text-sm leading-relaxed ${expandedPost === post.id ? '' : 'line-clamp-3'}`}
                      initial={false}
                      animate={{ height: expandedPost === post.id ? 'auto' : undefined }}
                    >
                      {post.content}
                    </motion.div>
                    <div className="flex items-center gap-3 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        className={`flex-1 text-sm ${post.dialect === 'Egyptian' ? 'text-amber-600 hover:text-amber-700' : 'text-indigo-600 hover:text-indigo-700'} flex items-center justify-center gap-1`}
                      >
                        {expandedPost === post.id ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Read more</span>
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleLike(post.id)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                          isLiked 
                            ? post.dialect === 'Egyptian' 
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-indigo-100 text-indigo-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        {isLiked ? 'Saved' : 'Save'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
