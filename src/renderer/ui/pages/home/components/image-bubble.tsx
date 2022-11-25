import { Col, Image, Row, Typography } from 'antd';
import React, { ReactNode } from 'react';
// eslint-disable-next-line import/no-cycle

interface ImageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  // indicator?: JSX.Element | null;
  // self?: boolean;
  localPath?: string; // local file path
  attachments?: string; // remote file url
  description?: ReactNode;
}

export default function ImageBubble({
  localPath,
  attachments,
  description,
  ...props
}: ImageBubbleProps) {
  if (description) {
    console.log('render with', attachments, localPath);
    // return image with description component
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div {...props}>
        <div className="overflow-hidden">
          <img
            className="object-cover h-auto max-h-[300px]"
            src={attachments || localPath}
            onLoad={() => {
              if (attachments && localPath) {
                URL.revokeObjectURL(localPath);
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
          src={attachments || localPath}
          alt="img"
          onLoad={() => {
            if (attachments && localPath) {
              URL.revokeObjectURL(localPath);
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
  localPath: undefined,
  attachments: undefined,
  description: undefined,
};
