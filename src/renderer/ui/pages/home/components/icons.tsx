/* eslint-disable react/require-default-props */
import React from 'react';

interface IconProps {
  color?: string;
  classname?: string;
  strokeWidth?: number;
  strokelinejoin?: 'inherit' | 'round' | 'miter' | 'bevel' | undefined;
  strokelinecap?: 'inherit' | 'round' | 'butt' | 'square' | undefined;
  background?: string;
}
function BellOff({
  color,
  classname = '',
  strokeWidth = 1.75,
  strokelinejoin = 'round',
  strokelinecap = 'round',
  background = 'none',
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
  background = 'none',
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
  background,
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
  background = 'none',
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

function CircleDashed({
  color,
  classname = '',
  strokeWidth = 1.75,
  strokelinejoin = 'round',
  strokelinecap = 'round',
  background = 'none',
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
        <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
        <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
        <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
        <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
        <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
        <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
        <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
        <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
      </svg>
    </span>
  );
}
function Photo({
  color,
  classname = '',
  strokeWidth = 1.75,
  strokelinejoin = 'round',
  strokelinecap = 'round',
  background = 'none',
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
        <line x1="15" y1="8" x2="15.01" y2="8" />
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
        <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
      </svg>
    </span>
  );
}
function CircleChecked({
  color,
  classname = '',
  strokeWidth = 1.75,
  strokelinejoin = 'round',
  strokelinecap = 'round',
  background = 'none',
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
        <circle cx="12" cy="12" r="9" fill={background} color={background} />
        <path d="M9 12l2 2l4 -4" color="white" />
      </svg>
    </span>
  );
}
function CircleSent({
  color,
  classname = '',
  strokeWidth = 1.75,
  strokelinejoin = 'round',
  strokelinecap = 'round',
  background = 'none',
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
        <circle cx="12" cy="12" r="9" color={background} />
        <path d="M9 12l2 2l4 -4" color={background} />
      </svg>
    </span>
  );
}

function FileText({
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
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
        <line x1="9" y1="9" x2="10" y2="9" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    </span>
  );
}

export {
  Bell,
  BellOff,
  Pin,
  PinOff,
  CircleDashed,
  CircleChecked,
  Photo,
  FileText,
  CircleSent,
};
