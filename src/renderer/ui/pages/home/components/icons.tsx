/* eslint-disable react/require-default-props */
import React from 'react';

interface IconProps {
  color?: string;
  classname?: string;
  strokeWidth?: number;
  strokelinejoin?: 'inherit' | 'round' | 'miter' | 'bevel' | undefined;
  strokelinecap?: 'inherit' | 'round' | 'butt' | 'square' | undefined;
}
function BellOff({
  color,
  classname = '',
  strokeWidth = 1.75,
  strokelinejoin = 'round',
  strokelinecap = 'round',
}: IconProps) {
  return (
    <span className={`anticon ${classname}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        color={color || undefined}
        strokeWidth={strokeWidth}
        strokeLinecap={strokelinecap}
        strokeLinejoin={strokelinejoin}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <line x1="3" y1="3" x2="21" y2="21" />
        <path d="M17 17h-13a4 4 0 0 0 2 -3v-3a7 7 0 0 1 1.279 -3.716m2.072 -1.934c.209 -.127 .425 -.244 .649 -.35a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3" />
        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
      </svg>
    </span>
  );
}

function Bell({
  color,
  classname = '',
  strokeWidth = 1.75,
  strokelinejoin = 'round',
  strokelinecap = 'round',
}: IconProps) {
  return (
    <span className={`anticon ${classname}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        color={color || undefined}
        strokeWidth={strokeWidth}
        strokeLinecap={strokelinecap}
        strokeLinejoin={strokelinejoin}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
      </svg>
    </span>
  );
}
function Pin({
  color,
  classname = '',
  strokeWidth = 1.75,
  strokelinejoin = 'round',
  strokelinecap = 'round',
}: IconProps) {
  return (
    <span className={`anticon ${classname}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        color={color || undefined}
        strokeWidth={strokeWidth}
        strokeLinecap={strokelinecap}
        strokeLinejoin={strokelinejoin}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6" />
        <line x1="12" y1="16" x2="12" y2="21" />
        <line x1="8" y1="4" x2="16" y2="4" />
      </svg>
    </span>
  );
}
function PinOff({
  color,
  classname = '',
  strokeWidth = 1.75,
  strokelinejoin = 'round',
  strokelinecap = 'round',
}: IconProps) {
  return (
    <span className={`anticon ${classname}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        color={color || undefined}
        strokeWidth={strokeWidth}
        strokeLinecap={strokelinecap}
        strokeLinejoin={strokelinejoin}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <line x1="3" y1="3" x2="21" y2="21" />
        <path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251" />
        <line x1="9" y1="15" x2="4.5" y2="19.5" />
        <line x1="14.5" y1="4" x2="20" y2="9.5" />
      </svg>
    </span>
  );
}

export { Bell, BellOff, Pin, PinOff };
