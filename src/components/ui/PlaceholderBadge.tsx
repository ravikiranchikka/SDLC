import { cx } from '@/components/layout/Container';
import { PLACEHOLDER_LABEL, getSlot } from '@/lib/content-status';

export interface PlaceholderBadgeProps {
  /** Content slot id, e.g. `home.hero`, as registered in `@/lib/content-status`. */
  slotId: string;
  /** Extra classes merged onto the badge element. */
  className?: string;
}

/**
 * Visible flag for any content slot whose status is not yet `approved` (AC-5).
 *
 * Behaviour is deliberately forgiving so a missing or mistyped slot id can never
 * break a build or a render:
 *  - unknown slot id  -> renders nothing;
 *  - status `approved` -> renders nothing;
 *  - otherwise         -> renders a small, non-intrusive badge naming the slot
 *    label and its owner so reviewers can see exactly what is outstanding.
 *
 * The authoritative list of slots lives in `src/lib/content-status.ts` and is
 * mirrored, human-readably, in docs/content-tracker.md.
 */
export function PlaceholderBadge({ slotId, className }: PlaceholderBadgeProps) {
  const slot = getSlot(slotId);

  if (!slot || slot.status === 'approved') {
    return null;
  }

  const dueSuffix = slot.dueDate ? ` \u00b7 due ${slot.dueDate}` : '';

  return (
    <span
      className={cx('placeholder-flag break-words', className)}
      data-slot-id={slot.id}
      data-slot-status={slot.status}
      data-testid="placeholder-flag"
      title={slot.notes}
    >
      <span aria-hidden="true">\u26a0</span>
      <span>
        {PLACEHOLDER_LABEL}: {slot.label} \u00b7 {slot.owner}
        {dueSuffix}
      </span>
    </span>
  );
}
