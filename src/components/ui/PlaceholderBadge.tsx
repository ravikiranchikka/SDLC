/**
 * SCRUM-31 - Placeholder content marker.
 *
 * AC-5 requires that a section whose client content has not yet been approved
 * still builds and renders, with the outstanding copy clearly flagged. The
 * machine-readable half of that contract lives on the section element itself
 * (`data-content-status="placeholder"`, emitted by `Section`); this component
 * is the human-readable half.
 *
 * Behaviour:
 *  - renders nothing when the slot is approved, so approved sections carry no
 *    visual noise;
 *  - renders nothing in a production build, so a live site never shows internal
 *    review chrome to a prospective patient - the `data-content-status`
 *    attribute remains available for automated checks in every environment;
 *  - otherwise renders a compact badge naming the owner responsible for the
 *    outstanding copy, matching the rows in docs/content-tracker.md.
 *
 * Presentational only: it reads `id`, `owner`, `status` and `note` from the
 * slot and never inspects the slot's value.
 */

import { isPlaceholder } from '../../lib/content';
import type { ContentSlot } from '../../types/content';

/** Colour treatment - `inverse` is used on the dark CTA band. */
export type PlaceholderBadgeTone = 'default' | 'inverse';

/** Shape, tap-friendly padding and typography shared by both tones. */
const BADGE_BASE =
  'inline-flex max-w-full min-w-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide';

const TONE_CLASSES: Readonly<Record<PlaceholderBadgeTone, string>> = {
  default: 'bg-brand-50 text-brand-700 ring-1 ring-brand-600',
  inverse: 'bg-white/15 text-white ring-1 ring-white/50',
};

export interface PlaceholderBadgeProps {
  /**
   * The content slot being rendered. The badge decides for itself whether to
   * appear, so sections can pass it unconditionally.
   */
  readonly slot: ContentSlot<unknown>;
  /** Colour treatment. Defaults to `default`. */
  readonly tone?: PlaceholderBadgeTone;
  /** Extra utility classes appended after the tone classes. */
  readonly className?: string;
}

/**
 * Render a visible "awaiting approved content" marker for a placeholder slot.
 *
 * @example
 * <SectionHeading
 *   heading={hero.heading}
 *   badge={<PlaceholderBadge slot={slot} />}
 * />
 */
export function PlaceholderBadge({
  slot,
  tone = 'default',
  className,
}: PlaceholderBadgeProps) {
  if (!isPlaceholder(slot)) {
    return null;
  }

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const note: string =
    typeof slot.note === 'string' && slot.note.length > 0
      ? slot.note
      : 'Awaiting approved client content.';

  const classes = [
    BADGE_BASE,
    TONE_CLASSES[tone],
    typeof className === 'string' ? className : '',
  ]
    .filter((value) => value.length > 0)
    .join(' ');

  return (
    <span
      data-testid="placeholder-badge"
      data-content-id={slot.id}
      data-content-status={slot.status}
      title={`${note} (owner: ${slot.owner})`}
      className={classes}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4l8 14H4l8-14z" />
        <path d="M12 10v3" />
        <path d="M12 16h.01" />
      </svg>

      <span className="truncate">Placeholder - {slot.owner}</span>
    </span>
  );
}
