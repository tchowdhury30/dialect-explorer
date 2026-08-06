import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, FolderPlus, Plus, X } from 'lucide-react';
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
      <header className="px-[22px] pb-3 pt-[26px]">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ink">
            Saved
          </h2>
          <span className="text-[0.59375rem] uppercase tabular-nums tracking-[0.12em] text-ink-soft">
            {saved.length} {saved.length === 1 ? 'phrase' : 'phrases'}
          </span>
        </div>

        {saved.length > 0 && (
          <div className="scroll-clean -mx-[22px] mt-3.5 flex gap-1.5 overflow-x-auto px-[22px] pb-1">
            {filters.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => setActiveFolder(folder.id)}
                aria-pressed={activeFolder === folder.id}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeFolder === folder.id
                    ? 'border-brand bg-brand text-on-brand'
                    : 'border-line bg-card text-ink-muted hover:border-brand-line hover:text-ink'
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
          <div className="flex h-full flex-col items-center justify-center px-10 pb-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-card border border-line">
              <Bookmark className="h-5 w-5 text-ink-soft" aria-hidden="true" />
            </div>
            <h3 className="text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ink">Nothing saved yet</h3>
            <p className="mt-2.5 max-w-xs text-[0.8125rem] italic leading-relaxed text-ink-soft">
              Tap the bookmark on any phrase to keep it here — handy for the ones you'll need
              on the day.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <p className="py-12 text-center text-[0.8125rem] italic text-ink-soft">
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
                  footer={
                    folders.length > 0 ? (
                      <select
                        value={getState(phrase.id).folderId ?? ''}
                        onChange={(e) => onAssignFolder(phrase.id, e.target.value || undefined)}
                        aria-label={`Folder for “${phrase.english}”`}
                        className="rounded-full border border-line bg-card px-2.5 py-1 text-xs text-ink-muted focus:border-brand focus:outline-none"
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
