/**
 * The rule-and-label pairing that opens every section.
 *
 * Uppercase, heavily tracked, tiny — a running head in a printed guide. The
 * right-hand slot carries the section's census (chapters, counts, voices).
 */
export function SectionHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-[22px] pb-[11px] pt-[30px]">
      <h2 className="text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ink">
        {title}
      </h2>
      {meta && (
        <span className="text-[0.59375rem] uppercase tabular-nums tracking-[0.12em] text-ink-soft">
          {meta}
        </span>
      )}
    </div>
  );
}
