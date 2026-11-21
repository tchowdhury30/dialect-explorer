import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Heart } from 'lucide-react';
import { CategoryScene } from './art/CategoryArt';
import { DialectId } from '../types';
import { DIALECTS, DIALECT_IDS } from '../lib/dialects';

interface CulturePost {
  id: string;
  title: string;
  content: string;
  dialect: DialectId;
  category: string;
}

const culturePosts: CulturePost[] = [
  {
    id: 'eg1',
    title: 'Hospitality & tea culture',
    content:
      'In Egypt, offering tea (شاي — "shai") is a fundamental part of hospitality. When visiting someone\'s home, expect to be offered tea multiple times. Refusing can be seen as impolite, so it\'s best to accept at least one cup. Egyptian tea is typically strong, sweet, and served in small glasses.',
    dialect: 'egyptian',
    category: 'Food & drink',
  },
  {
    id: 'eg2',
    title: 'What "inshallah" actually means',
    content:
      '"Inshallah" (إن شاء الله) literally means "God willing" and is used constantly in Egyptian conversation. While it can mean genuine hope that something will happen, it can also be a polite way of saying "probably not" or "maybe." Context and tone are key to understanding the real meaning.',
    dialect: 'egyptian',
    category: 'Language tips',
  },
  {
    id: 'eg3',
    title: 'Street food etiquette',
    content:
      'Egyptian street food is incredible but comes with its own etiquette. When eating koshari (كشري), Egypt\'s national dish, add the hot sauce (شطة — "shatta") gradually — it\'s very spicy. Ta\'ameya (فلافل) is best eaten fresh and hot. Street vendors often give generous portions, so don\'t be shy about sharing.',
    dialect: 'egyptian',
    category: 'Food & drink',
  },
  {
    id: 'eg4',
    title: 'Bargaining in the markets',
    content:
      'Bargaining is expected in Egyptian souqs and markets. Start at about 50% of the asking price and work your way up. The key phrase "khafeef shwaya" (خفف شوية) means "lower it a bit." Vendors respect good-natured haggling — it\'s part of the shopping experience, not an insult.',
    dialect: 'egyptian',
    category: 'Social customs',
  },
  {
    id: 'lv1',
    title: 'Coffee traditions',
    content:
      'In Jordan, Arabic coffee (قهوة عربية — "ahwe arabiyye") is a symbol of hospitality and tradition. Served in small cups without handles, it\'s typically flavoured with cardamom. The coffee ceremony involves three servings: the first for the guest, the second for enjoyment, and the third for digestion.',
    dialect: 'levantine',
    category: 'Food & drink',
  },
  {
    id: 'lv2',
    title: 'Greetings take their time',
    content:
      'Greetings in Jordan are elaborate and important. "Marhaba" (مرحبا) is a warm hello, but you\'ll often hear "ahlan wa sahlan" (أهلاً وسهلاً) meaning "welcome." Handshakes are common among men, while women may kiss on both cheeks. Take time with greetings — rushing them is considered rude.',
    dialect: 'levantine',
    category: 'Social customs',
  },
  {
    id: 'lv3',
    title: 'Everything is "yalla"',
    content:
      '"Yalla" (يلا) is one of the most versatile words in Jordanian Arabic. It can mean "let\'s go," "come on," "hurry up," or "okay, fine." You\'ll hear it constantly in Amman, and across the region. "Yalla bye" is a common friendly goodbye, while "yalla habibi" adds affection to any encouragement.',
    dialect: 'levantine',
    category: 'Language tips',
  },
  {
    id: 'lv4',
    title: 'Mezze is a social contract',
    content:
      'Mezze (مقبلات — "muqabilat") is central to Jordanian dining. These small dishes — hummus, baba ganoush, tabbouleh, fattoush — are meant for sharing. Meals are social events, often lasting hours. Don\'t fill up on mezze too quickly; the main course comes later. Use pita bread to scoop, and eat with your right hand.',
    dialect: 'levantine',
    category: 'Food & drink',
  },
];

const LIKED_KEY = 'likedPosts';

/** Each story is illustrated with the scene of its closest category. */
const SCENE_FOR: Record<string, string> = {
  'Food & drink': 'restaurants',
  'Language tips': 'conversation',
  'Social customs': 'tourism',
};

export function Culture({ dialect }: { dialect: DialectId }) {
  const [filter, setFilter] = useState<DialectId | 'all'>(dialect);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(LIKED_KEY);
      return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify([...liked]));
    } catch {
      // Non-fatal — likes just won't persist.
    }
  }, [liked]);

  const posts = useMemo(
    () => (filter === 'all' ? culturePosts : culturePosts.filter((p) => p.dialect === filter)),
    [filter]
  );

  const toggleLike = (id: string) =>
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const filters: Array<{ id: DialectId | 'all'; name: string }> = [
    { id: 'all', name: 'All' },
    ...DIALECT_IDS.map((id) => ({ id, name: DIALECTS[id].name })),
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="px-4 pb-2 pt-5 lg:mx-auto lg:w-full lg:max-w-7xl lg:px-10">
        <h2 className="font-display text-2xl font-semibold text-ink">Culture</h2>
        <p className="mt-0.5 text-sm text-ink-muted">
          Context the phrasebook can't give you
        </p>

        <div className="mt-3.5 flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full px-3.5 py-1.5 font-display text-sm font-semibold transition-colors ${
                filter === f.id
                  ? 'bg-brand text-on-brand shadow-[0_2px_0_rgba(0,0,0,0.18)]'
                  : 'bg-card text-ink-muted shadow-card hover:text-ink'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </header>

      <div className="scroll-clean flex-1 overflow-y-auto px-4 pb-8 pt-2 lg:mx-auto lg:w-full lg:max-w-7xl lg:px-10">
        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4 lg:space-y-0 xl:grid-cols-3">
          {posts.map((post, i) => {
            const isOpen = expanded === post.id;
            const isLiked = liked.has(post.id);

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 6) * 0.04, duration: 0.25 }}
                className="overflow-hidden rounded-card bg-card shadow-card"
              >
                <CategoryScene
                  category={SCENE_FOR[post.category] ?? 'conversation'}
                  dialect={post.dialect}
                  className="h-36 w-full"
                />

                <div className="p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.6875rem] font-medium text-brand-ink">
                      {post.category}
                    </span>
                    <span className="rounded-full bg-surface px-2.5 py-1 text-[0.6875rem] font-semibold text-ink-soft">
                      {DIALECTS[post.dialect].name}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold leading-snug text-ink">{post.title}</h3>

                  <p
                    className={`mt-2 text-sm leading-relaxed text-ink-muted ${
                      isOpen ? '' : 'line-clamp-3'
                    }`}
                  >
                    {post.content}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : post.id)}
                      aria-expanded={isOpen}
                      className="flex items-center gap-1 text-sm font-medium text-brand-ink hover:underline"
                    >
                      {isOpen ? 'Show less' : 'Read more'}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      aria-pressed={isLiked}
                      aria-label={isLiked ? 'Remove from saved' : 'Save this story'}
                      className={`rounded-full p-2 transition-colors ${
                        isLiked ? 'text-brand' : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
