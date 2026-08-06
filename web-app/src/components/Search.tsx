import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search as SearchIcon, WifiOff, X } from 'lucide-react';
import { PhraseCard, PhraseList } from './PhraseCard';
import { DialectId, Phrase, PhraseState } from '../types';
import { matchesQuery } from '../lib/phrase';
import { SectionHead } from './SectionHead';

interface SearchProps {
  phrases: Phrase[];
  dialect: DialectId;
  getState: (id: string) => PhraseState;
  onOpenPhrase: (phrase: Phrase) => void;
  onToggleBookmark: (id: string) => void;
}

export function Search({
  phrases,
  dialect,
  getState,
  onOpenPhrase,
  onToggleBookmark,
}: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);

  const results = useMemo(
    () => (query.trim() ? phrases.filter((p) => matchesQuery(p, query)) : []),
    [phrases, query]
  );

  /** Suggestions before the user types: whatever they open most. */
  const suggestions = useMemo(
    () =>
      [...phrases]
        .map((p) => ({ phrase: p, views: getState(p.id).timesQueried }))
        .filter((x) => x.views > 0)
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map((x) => x.phrase),
    [phrases, getState]
  );

  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex h-full flex-col">
      <header className="px-[22px] pb-4 pt-[26px]">
        <h2 className="mb-3 text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ink">
          Search
        </h2>

        <div className="relative">
          <SearchIcon
            className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
              hasQuery ? 'text-brand' : 'text-ink-soft'
            }`}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="English, Arabic, or transliteration…"
            aria-label="Search phrases"
            className="w-full rounded-card border border-line bg-card py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {!isOnline && (
          <p className="mt-3 flex items-center gap-2 rounded-lg bg-brand-softer px-3 py-2 text-xs text-ink-muted">
            <WifiOff className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
            You're offline. Phrases still work — audio needs a connection.
          </p>
        )}
      </header>

      <div className="scroll-clean flex-1 overflow-y-auto">
        {!hasQuery ? (
          suggestions.length > 0 ? (
            <>
              <SectionHead title="Recently viewed" meta={`${suggestions.length}`} />
              <PhraseList>
                {suggestions.map((phrase, i) => (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    dialect={dialect}
                    index={i}
                    state={getState(phrase.id)}
                    onOpen={() => onOpenPhrase(phrase)}
                    onToggleBookmark={() => onToggleBookmark(phrase.id)}
                  />
                ))}
              </PhraseList>
            </>
          ) : (
            <EmptyState
              title="Find a phrase fast"
              body="Type in English, Arabic script, or transliteration — all three are searched."
            />
          )
        ) : results.length === 0 ? (
          <EmptyState
            title="No matches"
            body={`Nothing found for “${query.trim()}”. Try a shorter or simpler word.`}
          />
        ) : (
          <>
            <SectionHead
              title="Results"
              meta={`${results.length} ${results.length === 1 ? 'match' : 'matches'}`}
            />
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <PhraseList>
                {results.map((phrase, i) => (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    dialect={dialect}
                    index={i}
                    state={getState(phrase.id)}
                    onOpen={() => onOpenPhrase(phrase)}
                    onToggleBookmark={() => onToggleBookmark(phrase.id)}
                  />
                ))}
              </PhraseList>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-10 pb-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-card border border-line">
        <SearchIcon className="h-5 w-5 text-ink-soft" aria-hidden="true" />
      </div>
      <h3 className="text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ink">{title}</h3>
      <p className="mt-2.5 max-w-xs text-[0.8125rem] italic leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
