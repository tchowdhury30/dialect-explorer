import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { FolderPlus, Plus, X } from 'lucide-react';
import { EmptyState } from './ListHead';
import { PhraseCard, PhraseList } from './PhraseCard';
import { DialectId, Folder, Phrase, PhraseState } from '../types';

interface BookmarksProps {
  phrases: Phrase[];
  dialect: DialectId;
  folders: Folder[];
  getState: (id: string) => PhraseState;
  onOpenPhrase: (phrase: Phrase) => void;
  onToggleBookmark: (id: string) => void;
  onAddFolder: (name: string) => void;
  onAssignFolder: (phraseId: string, folderId?: string) => void;
}

export function Bookmarks({
  phrases,
  dialect,
  folders,
  getState,
  onOpenPhrase,
  onToggleBookmark,
  onAddFolder,
  onAssignFolder,
}: BookmarksProps) {
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [draftName, setDraftName] = useState('');

  const saved = useMemo(
    () => phrases.filter((p) => getState(p.id).isBookmarked),
    [phrases, getState]
  );

  const visible = useMemo(() => {
    if (activeFolder === 'all') return saved;
    if (activeFolder === 'none') return saved.filter((p) => !getState(p.id).folderId);
    return saved.filter((p) => getState(p.id).folderId === activeFolder);
  }, [saved, activeFolder, getState]);

  const submitFolder = () => {
    const name = draftName.trim();
    if (name) onAddFolder(name);
    setDraftName('');
    setIsAdding(false);
  };

  const filters = [
    { id: 'all', name: 'All' },
    { id: 'none', name: 'Unfiled' },
    ...folders,
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="px-4 pb-2 pt-5 lg:mx-auto lg:w-full lg:max-w-7xl lg:px-10">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-ink">Saved</h2>
          <span className="text-xs font-semibold text-ink-soft">
            {saved.length} {saved.length === 1 ? 'phrase' : 'phrases'}
          </span>
        </div>

        {saved.length > 0 && (
          <div className="scroll-clean -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2">
            {filters.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => setActiveFolder(folder.id)}
                aria-pressed={activeFolder === folder.id}
                className={`shrink-0 rounded-full px-3.5 py-1.5 font-display text-sm font-semibold transition-colors ${
                  activeFolder === folder.id
                    ? 'bg-brand text-on-brand shadow-[0_2px_0_rgba(0,0,0,0.18)]'
                    : 'bg-card text-ink-muted shadow-card hover:text-ink'
                }`}
              >
                {folder.name}
              </button>
            ))}

            {isAdding ? (
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-brand-line bg-card pl-3 pr-1">
                <input
                  autoFocus
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitFolder();
                    if (e.key === 'Escape') {
                      setDraftName('');
                      setIsAdding(false);
                    }
                  }}
                  placeholder="Folder name"
                  aria-label="New folder name"
                  className="w-28 bg-transparent py-1.5 text-xs text-ink placeholder:text-ink-soft focus:outline-none"
                />
                <button
                  type="button"
                  onClick={submitFolder}
                  aria-label="Create folder"
                  className="rounded-full p-1 text-brand hover:bg-brand-soft"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftName('');
                    setIsAdding(false);
                  }}
                  aria-label="Cancel"
                  className="rounded-full p-1 text-ink-soft hover:bg-surface"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-brand-line hover:text-brand-ink"
              >
                <FolderPlus className="h-3.5 w-3.5" aria-hidden="true" />
                Folder
              </button>
            )}
          </div>
        )}
      </header>

      <div className="scroll-clean flex-1 overflow-y-auto">
        {saved.length === 0 ? (
          <EmptyState
            pose="nap"
            title="Nothing saved yet"
            body="Tap the heart on any phrase to keep it here, handy for the ones you'll need on the day."
          />
        ) : visible.length === 0 ? (
          <p className="py-12 text-center text-sm font-semibold text-ink-soft">
            Nothing in this folder yet.
          </p>
        ) : (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <PhraseList>
              {visible.map((phrase, i) => (
                <PhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  dialect={dialect}
                  index={i}
                  state={getState(phrase.id)}
                  onOpen={() => onOpenPhrase(phrase)}
                  onToggleBookmark={() => onToggleBookmark(phrase.id)}
                  showCategory
                  footer={
                    folders.length > 0 ? (
                      <select
                        value={getState(phrase.id).folderId ?? ''}
                        onChange={(e) => onAssignFolder(phrase.id, e.target.value || undefined)}
                        aria-label={`Folder for “${phrase.english}”`}
                        className="rounded-full bg-cat-soft px-3 py-1 font-display text-xs font-semibold text-cat-ink focus:outline-none focus:ring-2 focus:ring-cat"
                      >
                        <option value="">Unfiled</option>
                        {folders.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    ) : undefined
                  }
                />
              ))}
            </PhraseList>
          </motion.div>
        )}
      </div>
    </div>
  );
}
