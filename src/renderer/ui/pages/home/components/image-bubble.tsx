import { Col, Image, Row, Typography } from 'antd';
import React, { ReactNode } from 'react';
import { ImageBubbleProps, MessageBubbleProps } from './type';
// eslint-disable-next-line import/no-cycle

export default function ImageBubble({
  attachmentsMeta,
  attachments,
  description,
  className,
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
    <div className={className}>
      <div className="flex flex-wrap">
        {selectProperty?.map((path) => (
          <div key={path} className="img-reactive--wrap">
            <img
              className="object-cover h-full w-full"
              src={path}
              alt="img"
              onLoad={() => {
                if (attachments && attachmentsMeta) {
                  URL.revokeObjectURL(path);
                }
              }}
            />
          </div>
        ))}
      </div>
      {description}
    </div>
  );
}

ImageBubble.defaultProps = {
  attachmentsMeta: undefined,
  attachments: undefined,
  description: undefined,
  className: '',
};
