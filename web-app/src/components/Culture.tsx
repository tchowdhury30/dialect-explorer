import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DialectId } from '../types';
import { DIALECTS, DIALECT_IDS } from '../lib/dialects';

interface CulturePost {
  id: string;
  title: string;
  content: string;
  image: string;
  dialect: DialectId;
  category: string;
}

const culturePosts: CulturePost[] = [
  {
    id: 'eg1',
    title: 'Hospitality & tea culture',
    content:
      'In Egypt, offering tea (شاي — "shai") is a fundamental part of hospitality. When visiting someone\'s home, expect to be offered tea multiple times. Refusing can be seen as impolite, so it\'s best to accept at least one cup. Egyptian tea is typically strong, sweet, and served in small glasses.',
    image:
      'https://images.unsplash.com/photo-1629212093584-aad671e0619a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmFiaWMlMjB0ZWElMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjQzMjY4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'egyptian',
    category: 'Food & drink',
  },
  {
    id: 'eg2',
    title: 'What "inshallah" actually means',
    content:
      '"Inshallah" (إن شاء الله) literally means "God willing" and is used constantly in Egyptian conversation. While it can mean genuine hope that something will happen, it can also be a polite way of saying "probably not" or "maybe." Context and tone are key to understanding the real meaning.',
    image:
      'https://images.unsplash.com/photo-1714078663708-f9c4271799e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMHN0cmVldCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2NDMyNjg5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'egyptian',
    category: 'Language tips',
  },
  {
    id: 'eg3',
    title: 'Street food etiquette',
    content:
      'Egyptian street food is incredible but comes with its own etiquette. When eating koshari (كشري), Egypt\'s national dish, add the hot sauce (شطة — "shatta") gradually — it\'s very spicy. Ta\'ameya (فلافل) is best eaten fresh and hot. Street vendors often give generous portions, so don\'t be shy about sharing.',
    image:
      'https://images.unsplash.com/photo-1508972817144-6f62a84645c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYWlybyUyMEVneXB0JTIwbWFya2V0fGVufDF8fHx8MTc2NDMyNjE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'egyptian',
    category: 'Food & drink',
  },
  {
    id: 'eg4',
    title: 'Bargaining in the markets',
    content:
      'Bargaining is expected in Egyptian souqs and markets. Start at about 50% of the asking price and work your way up. The key phrase "khafeef shwaya" (خفف شوية) means "lower it a bit." Vendors respect good-natured haggling — it\'s part of the shopping experience, not an insult.',
    image:
      'https://images.unsplash.com/photo-1749815362062-33911b27ef9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMG1pZGRsZSUyMGVhc3QlMjBwYXR0ZXJufGVufDF8fHx8MTc2NDMyNjg5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'egyptian',
    category: 'Social customs',
  },
  {
    id: 'lv1',
    title: 'Coffee traditions',
    content:
      'In the Levantine region, Arabic coffee (قهوة عربية — "ahwe arabiyye") is a symbol of hospitality and tradition. Served in small cups without handles, it\'s typically flavoured with cardamom. The coffee ceremony involves three servings: the first for the guest, the second for enjoyment, and the third for digestion.',
    image:
      'https://images.unsplash.com/photo-1629212093584-aad671e0619a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmFiaWMlMjB0ZWElMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjQzMjY4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'levantine',
    category: 'Food & drink',
  },
  {
    id: 'lv2',
    title: 'Greetings take their time',
    content:
      'Greetings in Levantine culture are elaborate and important. "Marhaba" (مرحبا) is a warm hello, but you\'ll often hear "ahlan wa sahlan" (أهلاً وسهلاً) meaning "welcome." Handshakes are common among men, while women may kiss on both cheeks. Take time with greetings — rushing them is considered rude.',
    image:
      'https://images.unsplash.com/photo-1733272967076-3a2ce81226e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGVycmFuZWFuJTIwY29hc3QlMjBzdW5zZXR8ZW58MXx8fHwxNzY0MzI2ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'levantine',
    category: 'Social customs',
  },
  {
    id: 'lv3',
    title: 'Everything is "yalla"',
    content:
      '"Yalla" (يلا) is one of the most versatile words in Levantine Arabic. It can mean "let\'s go," "come on," "hurry up," or "okay, fine." You\'ll hear it constantly in Jordan, Syria, Lebanon, and Palestine. "Yalla bye" is a common friendly goodbye, while "yalla habibi" adds affection to any encouragement.',
    image:
      'https://images.unsplash.com/photo-1575650693902-8ead804c0732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQZXRyYSUyMEpvcmRhbiUyMGFuY2llbnR8ZW58MXx8fHwxNzY0MzI2MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'levantine',
    category: 'Language tips',
  },
  {
    id: 'lv4',
    title: 'Mezze is a social contract',
    content:
      'Mezze (مقبلات — "muqabilat") is central to Levantine dining. These small dishes — hummus, baba ganoush, tabbouleh, fattoush — are meant for sharing. Meals are social events, often lasting hours. Don\'t fill up on mezze too quickly; the main course comes later. Use pita bread to scoop, and eat with your right hand.',
    image:
      'https://images.unsplash.com/photo-1619366545848-0d3b76ba523e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZXZhbnRpbmUlMjBmb29kJTIwY29sb3JmdWx8ZW58MXx8fHwxNzY0MzI2ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dialect: 'levantine',
    category: 'Food & drink',
  },
];

const LIKED_KEY = 'likedPosts';

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
    ...DIALECT_IDS.map((id) => ({ id, name: DIALECTS[id].label })),
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="px-[22px] pb-3.5 pt-[26px]">
        <h2 className="text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ink">
          Culture
        </h2>
        <p className="mt-1.5 text-[0.8125rem] italic text-ink-soft">
          Context the phrasebook can't give you
        </p>

        <div className="mt-3.5 flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.id
                  ? 'border-brand bg-brand text-on-brand'
                  : 'border-line bg-card text-ink-muted hover:border-brand-line hover:text-ink'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </header>

      <div className="scroll-clean flex-1 overflow-y-auto px-[22px] pb-8 pt-1">
        <div className="space-y-4">
          {posts.map((post, i) => {
            const isOpen = expanded === post.id;
            const isLiked = liked.has(post.id);

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 6) * 0.04, duration: 0.25 }}
                className="overflow-hidden rounded-card border border-line bg-card"
              >
                <ImageWithFallback
                  src={post.image}
                  alt=""
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />

                <div className="p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.6875rem] font-medium text-brand-ink">
                      {post.category}
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-ink-soft">
                      {DIALECTS[post.dialect].label}
                    </span>
                  </div>

                  <h3 className="text-lg font-normal leading-snug tracking-[-0.01em] text-ink">{post.title}</h3>

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
