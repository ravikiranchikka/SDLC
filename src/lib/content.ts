/**
 * SCRUM-31 - Content slot helpers.
 *
 * Pure, framework-free helpers for building and inspecting `ContentSlot`
 * values. May import from `src/types` only: no React, no next/*, no JSX.
 *
 * Placeholder slots NEVER throw - a missing piece of client copy must degrade
 * to documented stand-in content rather than failing the build (AC-5).
 */

import type { ContentSlot, ContentStatus } from '../types/content';

/**
 * Build a slot for content the client has signed off.
 *
 * @param id    Stable slot id, e.g. `home.hero`. Must match the tracker row.
 * @param owner Person or role accountable for the content.
 * @param value The approved content.
 */
export function approved<T>(id: string, owner: string, value: T): ContentSlot<T> {
  return { id, owner, status: 'approved', value };
}

/**
 * Build a slot for stand-in content awaiting client approval.
 *
 * @param id    Stable slot id, e.g. `home.testimonials`.
 * @param owner Person or role accountable for supplying the real content.
 * @param value Stand-in content that keeps the page renderable.
 * @param note  What is outstanding - surfaced in docs/content-tracker.md.
 */
export function placeholder<T>(
  id: string,
  owner: string,
  value: T,
  note: string,
): ContentSlot<T> {
  return { id, owner, status: 'placeholder', note, value };
}

/** True when the slot is still carrying stand-in content. */
export function isPlaceholder(slot: ContentSlot<unknown>): boolean {
  return slot.status === 'placeholder';
}

/** True when the slot carries client-approved content. */
export function isApproved(slot: ContentSlot<unknown>): boolean {
  return slot.status === 'approved';
}

/**
 * Narrowing guard used by `collectSlots` to recognise slot-shaped values
 * without relying on a runtime marker.
 */
export function isContentSlot(candidate: unknown): candidate is ContentSlot<unknown> {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const record = candidate as Record<string, unknown>;
  const status = record.status;
  const isKnownStatus: boolean = status === 'approved' || status === 'placeholder';

  return (
    typeof record.id === 'string' &&
    typeof record.owner === 'string' &&
    isKnownStatus &&
    'value' in record
  );
}

/**
 * Flatten a content module (an object whose values are content slots) into a
 * stable, id-sorted list. Used by the tracker checks and the unit tests.
 *
 * Non-slot values are ignored so a module can also export helpers or metadata.
 */
export function collectSlots(record: Readonly<Record<string, unknown>>): ContentSlot<unknown>[] {
  const slots: ContentSlot<unknown>[] = [];

  for (const key of Object.keys(record)) {
    const candidate = record[key];
    if (isContentSlot(candidate)) {
      slots.push(candidate);
    }
  }

  return slots.sort((left, right) => left.id.localeCompare(right.id));
}

/** Every slot in the record that still needs client content. */
export function pendingSlots(
  record: Readonly<Record<string, unknown>>,
): ContentSlot<unknown>[] {
  return collectSlots(record).filter(isPlaceholder);
}

/**
 * Value used for the `data-content-status` DOM attribute so that AC-5 is
 * machine-checkable from the rendered page.
 */
export function contentStatusAttribute(slot: ContentSlot<unknown>): ContentStatus {
  return slot.status;
}
