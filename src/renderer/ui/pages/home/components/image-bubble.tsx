import { Col, Image, Row, Typography } from 'antd';
import React, { ReactNode } from 'react';
// eslint-disable-next-line import/no-cycle

interface ImageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  // indicator?: JSX.Element | null;
  // self?: boolean;
  attachmentsMeta?: { name: string; size: number; path: string }[]; // local file path
  attachments?: string[]; // remote file url
  description?: ReactNode;
}

export default function ImageBubble({
  attachmentsMeta,
  attachments,
  description,
  ...props
}: ImageBubbleProps) {
  // if (description) {
  //   // return image with description component
  //   return (
  //     // eslint-disable-next-line react/jsx-props-no-spreading
  //     <div {...props}>
  //       <div className="overflow-hidden">
  //         <img
  //           className="object-cover h-auto max-h-[300px]"
  //           src={attachments || localPath}
  //           onLoad={() => {
  //             if (attachments && localPath) {
  //               URL.revokeObjectURL(localPath);
  //             }
  //           }}
  //           alt="img"
  //         />
  //       </div>
  //       {description}
  //     </div>
  //   );
  // }

  const selectProperty =
    attachments || attachmentsMeta?.map((meta) => meta.path);
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...props}>
      <div className="overflow-hidden">
        {selectProperty?.map((path) => (
          <img
            className="object-cover h-auto max-h-[300px]"
            src={path}
            alt="img"
            onLoad={() => {
              if (attachments && attachmentsMeta) {
                URL.revokeObjectURL(path);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

ImageBubble.defaultProps = {
  // indicator: undefined,
  // self: false,
  attachmentsMeta: undefined,
  attachments: undefined,
  description: undefined,
};
