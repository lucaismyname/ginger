import type { ReactNode, SVGProps } from "react";

export function Wrapper(
  props: SVGProps<SVGSVGElement> & {
    className?: string;
    width?: number;
    height?: number;
    viewBox?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    children?: ReactNode;
  },
) {
  const {
    className,
    width,
    height,
    viewBox,
    fill,
    stroke,
    strokeWidth,
    strokeLinecap,
    strokeLinejoin,
    children,
    ...rest
  } = props;
  return (
    <svg
      data-ginger-component="Wrapper"
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? 24}
      height={height ?? 24}
      viewBox={viewBox ?? "0 0 24 24"}
      fill="none"
      stroke={stroke ?? "currentColor"}
      strokeWidth={strokeWidth ?? 2}
      strokeLinecap={strokeLinecap ?? "round"}
      strokeLinejoin={strokeLinejoin ?? "round"}
      className={className}
      aria-hidden
      role="presentation"
      {...rest}
    >
      {children}
    </svg>
  );
}
