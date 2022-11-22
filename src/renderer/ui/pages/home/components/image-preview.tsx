import { CloseCircleFilled } from '@ant-design/icons';
import { Image } from 'antd';
import React, { memo } from 'react';

function InternalImage({ file, onClose }: { file: File; onClose: () => void }) {
  const src = React.useRef(URL.createObjectURL(file));
  return (
    <li className="relative inline">
      <CloseCircleFilled
        className="absolute z-10 top-0 right-0 p-1 "
        onClick={onClose}
        style={{
          fill: 'white',
        }}
      />
      <div className="rounded overflow-clip ">
        <Image
          width="80px"
          height="80px"
          style={{
            objectFit: 'cover',
          }}
          src={src.current}
          preview={false}
          onLoad={() => {
            URL.revokeObjectURL(src.current);
          }}
        />
      </div>
    </li>
  );
}

const ImagePreview = memo(InternalImage);
export default ImagePreview;
