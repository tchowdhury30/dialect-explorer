import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { Bisbis } from './art/Bisbis';

/**
 * "Help Sook Sout grow": ask for a dialect, offer to record, suggest words.
 *
 * Submitted to Netlify Forms (the static form named "contact" in index.html is
 * what Netlify detects at deploy), so there is still no backend to run.
 * Submissions appear in the Netlify dashboard under Forms, which can email
 * them on. Contact details are optional: only for people who want a reply.
 */

const KINDS = [
  { id: 'dialect', label: 'Add my dialect', hint: 'Which dialect should we record next?' },
  { id: 'record', label: 'I can record', hint: 'Which dialect do you speak, and where are you from?' },
  { id: 'words', label: 'Suggest words', hint: 'Which words or phrases are missing?' },
  { id: 'other', label: 'Something else', hint: 'What’s on your mind?' },
] as const;
type Kind = (typeof KINDS)[number]['id'];

export function GrowCard({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={{ scale: 0.98 }}
      className="press relative flex w-full items-center gap-3 overflow-hidden rounded-card bg-gradient-to-br from-brand-soft to-card py-3 pl-3 pr-4 text-left shadow-card"
    >
      <Bisbis pose="peek" className="h-14 w-20 shrink-0 translate-y-2" />
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-semibold text-ink">Help Sook Sout grow</span>
        <span className="block text-[0.8125rem] leading-snug text-ink-muted">
          Want another dialect, more words, or to record your voice? Tell us.
        </span>
      </span>
      <ArrowRight className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
    </motion.button>
  );
}

export function ContactSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [kind, setKind] = useState<Kind>('dialect');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const firstRef = useRef<HTMLButtonElement>(null);

  // Reset on the way out, so the next open starts on the form.
  const close = useCallback(() => {
    setState('idle');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setState('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          kind,
          message: message.trim(),
          contact: contact.trim(),
        }).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      setMessage('');
      setContact('');
    } catch {
      setState('error');
    }
  };

  const hint = KINDS.find((k) => k.id === kind)?.hint;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px] sm:items-center sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Help Sook Sout grow"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full rounded-t-[1.75rem] bg-surface px-5 pb-6 pt-5 shadow-float sm:max-w-md sm:rounded-[1.75rem]"
          >
            <Bisbis pose="peek" className="absolute -top-[3.2rem] right-6 w-20" talking={state === 'sent'} />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute left-4 top-4 rounded-full p-1.5 text-ink-soft hover:bg-card hover:text-ink"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {state === 'sent' ? (
              <div className="py-8 text-center">
                <p lang="ar" dir="rtl" className="text-3xl font-bold text-brand">
                  شكراً!
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">Thank you!</h2>
                <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
                  Your message is on its way to the Sook Sout team.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 rounded-2xl bg-brand px-6 py-3 font-display font-semibold text-on-brand shadow-[0_3px_0_rgba(0,0,0,0.18)]"
                >
                  Back to the souk
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="pt-6">
                <h2 className="font-display text-xl font-semibold text-ink">Help Sook Sout grow</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Every dialect here was recorded by real people. Want yours added, or want to help?
                </p>

                <fieldset className="mt-4 flex flex-wrap gap-2">
                  <legend className="sr-only">What is it about?</legend>
                  {KINDS.map((k, i) => (
                    <button
                      key={k.id}
                      ref={i === 0 ? firstRef : undefined}
                      type="button"
                      onClick={() => setKind(k.id)}
                      aria-pressed={kind === k.id}
                      className={`rounded-full px-3.5 py-1.5 font-display text-sm font-semibold transition ${
                        kind === k.id ? 'bg-brand text-on-brand shadow-[0_2px_0_rgba(0,0,0,0.18)]' : 'bg-card text-ink-muted shadow-card'
                      }`}
                    >
                      {k.label}
                    </button>
                  ))}
                </fieldset>

                <label className="mt-4 block">
                  <span className="mb-1 block text-sm font-semibold text-ink">{hint}</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={2000}
                    rows={4}
                    className="w-full resize-none rounded-2xl bg-card p-3 text-sm text-ink shadow-card placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder={kind === 'dialect' ? 'e.g. Moroccan Darija, Gulf, Sudanese…' : ''}
                  />
                </label>

                <label className="mt-3 block">
                  <span className="mb-1 block text-sm font-semibold text-ink">
                    Email or Instagram <span className="font-normal text-ink-soft">(optional, only if you want a reply)</span>
                  </span>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    maxLength={200}
                    autoComplete="email"
                    className="w-full rounded-2xl bg-card px-3 py-2.5 text-sm text-ink shadow-card focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </label>

                {state === 'error' && (
                  <p role="alert" className="mt-3 text-sm font-semibold text-[#d94a4a]">
                    That didn’t send. Check your connection and try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state === 'sending' || !message.trim()}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 font-display font-semibold text-on-brand shadow-[0_3px_0_rgba(0,0,0,0.18)] transition active:translate-y-0.5 disabled:opacity-40"
                >
                  {state === 'sending' ? 'Sending…' : 'Send'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
