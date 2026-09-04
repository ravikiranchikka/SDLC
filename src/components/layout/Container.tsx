import type { ElementType, ReactNode } from 'react';

/**
 * Tiny class-name joiner used across the component tree.
 *
 * Deliberately dependency-free (no `clsx`/`classnames`): the dependency manifest
 * is owned outside this story, so nothing here may add packages.
 *
 * @param classes Class names; falsy entries are ignored.
 * @returns The space-separated class string.
 */
export function cx(
  ...classes: ReadonlyArray<string | false | null | undefined>
): string {
  return classes.filter((value): value is string => Boolean(value)).join(' ');
}

export interface ContainerProps {
  /** Element or component to render as. Defaults to a plain `div`. */
  as?: ElementType;
  /** Additional classes merged after `.container-page`. */
  className?: string;
  /** Optional test hook forwarded to the rendered element. */
  'data-testid'?: string;
  children: ReactNode;
}

/**
 * Shared layout primitive applying the site's max width and responsive gutters
 * (`.container-page` in globals.css). Keeping the width rules in one place is
 * part of the horizontal-overflow safety net required by AC-2.
 */
export function Container({
  as,
  className,
  children,
  'data-testid': testId,
}: ContainerProps) {
  const Component: ElementType = as ?? 'div';

  return (
    <Component className={cx('container-page', className)} data-testid={testId}>
      {children}
    </Component>
  );
}
