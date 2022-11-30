import { Col, Image, Row, Typography } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
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
  // const [height, setHeight] = useState(0);
  // const [loaded, setLoaded] = useState(false);
  // const div = useRef<HTMLDivElement>(null);
  const selectProperty =
    attachmentsMeta?.map((meta) => meta.path) || attachments;

  // useEffect(() => {
  //   if (loaded) setHeight(div.current?.clientHeight || 0);
  // }, [loaded]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div
      className={className}
      // style={{ height: height !== 0 ? height : 'auto' }}
      // ref={div}
    >
      <div className="flex flex-wrap">
        {selectProperty?.map((path, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className="img-reactive--wrap">
            <img
              className="object-cover h-full w-full "
              src={path}
              alt="img"
              // onLoad={() => setLoaded(true)}
              // onLoad={() => {
              //   if (attachments && attachmentsMeta) {
              //     URL.revokeObjectURL(path);
              //   }
              // }}
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
