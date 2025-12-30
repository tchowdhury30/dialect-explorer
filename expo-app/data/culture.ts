export interface Speaker {
  id: string;
  name: string;
  dialect: 'Egyptian' | 'Levantine';
  role: string;
  bio: string;
  avatarColor: string;
  samples: { id: string; title: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  dialect: 'Egyptian' | 'Levantine';
  imageColor: string;
  tag: string;
}

export const speakers: Speaker[] = [
  {
    id: 'sara',
    name: 'Sara',
    dialect: 'Egyptian',
    role: 'Cairo-based host',
    bio: 'Radio storyteller sharing neighborhood slang and humor.',
    avatarColor: '#fbbf24',
    samples: [
      { id: 'sara-1', title: 'Market banter' },
      { id: 'sara-2', title: 'Family greetings' },
    ],
  },
  {
    id: 'youssef',
    name: 'Youssef',
    dialect: 'Egyptian',
    role: 'Music producer',
    bio: 'Weaves lyrics into everyday speech, laid-back cadence.',
    avatarColor: '#fb923c',
    samples: [
      { id: 'youssef-1', title: 'Studio chit-chat' },
      { id: 'youssef-2', title: 'Nightlife tips' },
    ],
  },
  {
    id: 'lina',
    name: 'Lina',
    dialect: 'Levantine',
    role: 'Amman guide',
    bio: 'Loves cafés, street art, and gentle Levantine expressions.',
    avatarColor: '#818cf8',
    samples: [
      { id: 'lina-1', title: 'Café small talk' },
      { id: 'lina-2', title: 'Directions & welcomes' },
    ],
  },
  {
    id: 'omar',
    name: 'Omar',
    dialect: 'Levantine',
    role: 'History buff',
    bio: 'Tells citadel tales with crisp pronunciation.',
    avatarColor: '#22c55e',
    samples: [
      { id: 'omar-1', title: 'Museum intro' },
      { id: 'omar-2', title: 'Local myths' },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Café etiquette in Amman',
    excerpt: 'Ordering like a local, tipping norms, and when to linger.',
    body: 'Longform body placeholder — add the full story here. Include phrases, anecdotes, and your friend’s illustrations when ready.',
    dialect: 'Levantine',
    imageColor: '#c7d2fe',
    tag: 'Cafés',
  },
  {
    id: 'blog-2',
    title: 'Cairo street food map',
    excerpt: 'Koshary, taameya, and where to grab them at midnight.',
    body: 'Story content goes here. Drop in drawings for each stop when assets are ready.',
    dialect: 'Egyptian',
    imageColor: '#fed7aa',
    tag: 'Food',
  },
  {
    id: 'blog-3',
    title: 'Weekend in Wadi Rum',
    excerpt: 'Desert phrases, stargazing, and greeting your guide.',
    body: 'Add the full article, photos, and illustrations later. Keep this as a placeholder reader.',
    dialect: 'Levantine',
    imageColor: '#bae6fd',
    tag: 'Travel',
  },
  {
    id: 'blog-4',
    title: 'Metro manners in Cairo',
    excerpt: 'Tickets, seats, and kind gestures on the go.',
    body: 'Placeholder content for the metro piece. Replace with narrative and visuals.',
    dialect: 'Egyptian',
    imageColor: '#fde68a',
    tag: 'Transit',
  },
];
