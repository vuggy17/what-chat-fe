import { Col, Image, Row, Typography } from 'antd';
import React, { ReactNode } from 'react';
// eslint-disable-next-line import/no-cycle

interface ImageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  // indicator?: JSX.Element | null;
  // self?: boolean;
  path?: string; // local file path
  attachments?: string; // remote file url
  description?: ReactNode;
}

export default function ImageBubble({
  path,
  attachments,
  description,
  ...props
}: ImageBubbleProps) {
  if (description) {
    console.log('description', path, attachments, description);

    // return image with description component
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div {...props}>
        <div className="overflow-hidden">
          <img
            className="object-cover h-auto max-h-[300px]"
            src={path || attachments}
            onLoad={() => {
              if (path) {
                URL.revokeObjectURL(path);
              }
            }}
            alt="img"
          />
        </div>
        {description}
      </div>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...props}>
      <div className="overflow-hidden">
        <img
          className="object-cover h-auto max-h-[300px]"
          src={path || attachments}
          alt="img"
          onLoad={() => {
            if (path) {
              URL.revokeObjectURL(path);
            }
          }}
        />
      </div>
    </div>
  );
}

ImageBubble.defaultProps = {
  // indicator: undefined,
  // self: false,
  path: undefined,
  attachments: undefined,
  description: undefined,
};
