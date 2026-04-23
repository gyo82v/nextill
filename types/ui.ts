import React from "react";

export type DividerProps = React.HTMLAttributes<HTMLHRElement> & {
  className?: string;
};

export type DotLineDividerProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  dotClassName?: string;
  lineClassName?: string;
};

export type IconDividerProps = {
  icon?: React.ReactNode;
  className?: string;
};