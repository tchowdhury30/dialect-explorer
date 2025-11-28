import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { PhraseCard } from './PhraseCard';
import { PhraseDetail } from './PhraseDetail';
import { Bookmark, Heart } from 'lucide-react';
import { Folder, Phrase } from '../types';

interface BookmarksProps {
  onPhraseUpdate: (phrase: Phrase) => void;
  allPhrases: Phrase[];
  currentDialect: 'Egyptian' | 'Levantine';
  folders: Folder[];
  onAddFolder: (name: string) => void;
  onAssignFolder: (phraseId: string, folderId?: string) => void;
}

export function Bookmarks({ onPhraseUpdate, allPhrases, currentDialect, folders, onAddFolder, onAssignFolder }: BookmarksProps) {
  const dialectColors = {
    Egyptian: {
      text: 'text-amber-600',
    },
    Levantine: {
      text: 'text-indigo-600',
    },
  };
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [newFolderName, setNewFolderName] = useState('');

  const bookmarkedPhrases = useMemo(() => {
    return allPhrases.filter((p) => p.isBookmarked);
  }, [allPhrases]);

  const filteredPhrases = useMemo(() => {
    if (selectedFolderId === 'all') return bookmarkedPhrases;
    if (selectedFolderId === 'none') return bookmarkedPhrases.filter((p) => !p.folderId);
    return bookmarkedPhrases.filter((p) => p.folderId === selectedFolderId);
  }, [bookmarkedPhrases, selectedFolderId]);

  const handlePhraseClick = (phrase: Phrase) => {
    const updatedPhrase = { ...phrase, timesQueried: phrase.timesQueried + 1 };
    onPhraseUpdate(updatedPhrase);
    setSelectedPhrase(updatedPhrase);
  };

  const handleBookmarkToggle = (phrase: Phrase) => {
    const updatedPhrase = { ...phrase, isBookmarked: !phrase.isBookmarked };
    onPhraseUpdate(updatedPhrase);
    if (selectedPhrase?.id === phrase.id) {
      setSelectedPhrase(updatedPhrase);
    }
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    onAddFolder(name);
    setNewFolderName('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-5 pb-3 px-3 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <Heart className={`w-5 h-5 ${dialectColors[currentDialect].text} fill-current`} />
          <h2 className="text-gray-900">Saved Phrases</h2>
        </div>
        <p className={`text-sm ${dialectColors[currentDialect].text}`}>
          ✨ {bookmarkedPhrases.length} {bookmarkedPhrases.length === 1 ? 'phrase' : 'phrases'} saved
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5 items-center">
          <span className="text-sm text-gray-600">Folders:</span>
          {[
            { id: 'all', name: 'All' },
            { id: 'none', name: 'Unfiled' },
            ...folders,
          ].map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolderId(folder.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedFolderId === folder.id
                  ? currentDialect === 'Egyptian'
                    ? 'border-amber-500 text-amber-700 bg-amber-50'
                    : 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {folder.name}
            </button>
          ))}
        </div>
        <div className="mt-1 flex gap-1.5 flex-col sm:flex-row sm:items-center">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="w-full sm:flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={handleCreateFolder}
            className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors w-full sm:w-auto"
          >
            Add
          </button>
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-0">
        {bookmarkedPhrases.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <Bookmark className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-500">
              Tap the bookmark icon on any phrase to save it for quick access
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPhrases.map((phrase, index) => (
              <motion.div
                key={phrase.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <PhraseCard
                  phrase={phrase}
                  onClick={() => handlePhraseClick(phrase)}
                  onBookmarkToggle={(e) => {
                    e.stopPropagation();
                    handleBookmarkToggle(phrase);
                  }}
                  currentDialect={currentDialect}
                />
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <span>Folder:</span>
                  <select
                    value={phrase.folderId || ''}
                    onChange={(e) => onAssignFolder(phrase.id, e.target.value || undefined)}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="">None</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Phrase Detail Modal */}
      {selectedPhrase && (
        <PhraseDetail
          phrase={selectedPhrase}
          onClose={() => setSelectedPhrase(null)}
          onBookmarkToggle={() => {
            handleBookmarkToggle(selectedPhrase);
          }}
        />
      )}
    </div>
  );
}
