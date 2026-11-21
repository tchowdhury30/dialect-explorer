import { ReactNode } from 'react';
import { Bisbis } from './art/Bisbis';

/** A friendly section heading above a list of cards. */
export function ListHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-5 pb-2.5 pt-5 lg:mx-auto lg:max-w-7xl lg:px-10">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {meta && <span className="text-xs font-semibold text-ink-soft">{meta}</span>}
    </div>
  );
}

/** Empty states get Bisbis: napping when there's nothing, peeking otherwise. */
export function EmptyState({
  title,
  body,
  pose = 'peek',
  children,
}: {
  title: string;
  body: string;
  pose?: 'peek' | 'nap';
  children?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-10 pb-16 text-center">
      <Bisbis pose={pose} className={pose === 'nap' ? 'mb-2 w-44 text-ink' : 'mb-3 w-24'} />
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-ink-muted">{body}</p>
      {children}
    </div>
  );
}
