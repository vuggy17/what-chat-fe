/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable promise/always-return */
import React from 'react';
// eslint-disable-next-line import/no-cycle

interface ImageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  indicator?: JSX.Element | null;
  self?: boolean;
  path?: string;
  attachments?: string;
}

export default function ImageBubble({ indicator, ...props }: ImageBubbleProps) {
  return (
    <div
      {...props}
      className="w-auto h-[300px] flex  "
      style={{ flexDirection: props.self ? 'row-reverse' : 'inherit' }}
    >
      {props.self && indicator && (
        <div className="h-full flex items-end">{indicator}</div>
      )}
      <img
        src={props.path || props.attachments}
        alt="img"
        className="overflow-hidden w-auto h-[300px]"
      />
    </div>
  );
}

ImageBubble.defaultProps = {
  indicator: undefined,
  self: false,
  path: undefined,
  attachments: undefined,
};
