/**
 * SCRUM-31 - Container primitive.
 *
 * The single horizontal-rhythm wrapper used by the header, every page section
 * and the footer. Centralising the max width and gutters here is what keeps a
 * 360px viewport free of horizontal scrolling (AC-2): no layout block is
 * allowed to set its own ad-hoc padding or a fixed pixel width.
 *
 * Presentational only - imports nothing from `src/app`.
 */

import type { ElementType, ReactNode } from 'react';

/** Base classes shared by every container instance. */
const CONTAINER_CLASSES = 'mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6 lg:px-8';

export interface ContainerProps {
  /** Content rendered inside the container. */
  readonly children: ReactNode;
  /** Extra utility classes appended after the base container classes. */
  readonly className?: string;
  /** Element to render, e.g. `section`, `nav`, `footer`. Defaults to `div`. */
  readonly as?: ElementType;
  /** Optional `data-testid` forwarded to the rendered element. */
  readonly testId?: string;
}

/**
 * Render children inside the shared max-width / gutter wrapper.
 *
 * @example
 * <Container as="section" className="py-12 md:py-20">...</Container>
 */
export function Container({
  children,
  className,
  as: Component = 'div',
  testId,
}: ContainerProps) {
  const classes =
    typeof className === 'string' && className.length > 0
      ? `${CONTAINER_CLASSES} ${className}`
      : CONTAINER_CLASSES;

  return (
    <Component className={classes} data-testid={testId}>
      {children}
    </Component>
  );
}
