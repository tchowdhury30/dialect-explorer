import { Category } from '../types';
import { CategoryIcon } from './icons/CategoryIcons';

interface CategoryCellProps {
  category: Category;
  phraseCount: number;
  /** The last cell spans the full width and sits on one line. */
  wide?: boolean;
  onClick: () => void;
}

/**
 * One cell of the index.
 *
 * Cells are divided by hairlines rather than separated by gaps, so the seven
 * chapters read as a ruled contents page. An odd count leaves a hole in a
 * two-column grid, so the final cell spans both columns instead.
 */
export function CategoryCell({ category, phraseCount, wide = false, onClick }: CategoryCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex border-b border-line px-4 py-5 text-center transition-colors last:border-b-0 ${
        wide
          ? 'col-span-2 flex-row items-center justify-center gap-3'
          : 'min-h-[6.25rem] flex-col items-center justify-center odd:border-r odd:border-line'
      }`}
    >
      <CategoryIcon
        category={category.id}
        className={`h-6 w-6 transition-colors ${
          wide ? 'text-brand' : 'text-ink-muted group-hover:text-brand'
        }`}
      />

      <span className={wide ? '' : 'mt-3'}>
        <span className="block text-sm tracking-[-0.005em] text-ink transition-colors group-hover:text-brand-ink">
          {category.name}
        </span>
        {!wide && (
          <span className="mt-1 block text-[0.625rem] tabular-nums tracking-[0.14em] text-ink-soft">
            {phraseCount}
          </span>
        )}
      </span>

      {wide && (
        <span className="text-[0.625rem] tabular-nums tracking-[0.14em] text-ink-soft">
          {phraseCount}
        </span>
      )}
    </button>
  );
}
