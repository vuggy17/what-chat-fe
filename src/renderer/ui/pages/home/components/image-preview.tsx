import Icon, { CloseCircleFilled } from '@ant-design/icons';
import { Image, Tooltip } from 'antd';
import React, { memo } from 'react';
import { ReactComponent as CloseCircle } from '../../../../../../assets/icons/close-circle.svg';

function InternalImage({ file, onClose }: { file: File; onClose: () => void }) {
  const src = React.useRef(URL.createObjectURL(file));
  return (
    <div className="relative inline">
      <Tooltip title="Remove attachment">
        <Icon
          component={CloseCircle}
          className="absolute z-10 top-0 right-0 p-1 "
          onClick={onClose}
        />
      </Tooltip>
      <div className="h-auto relative">
        <Image
          width="80px"
          height="80px"
          src={src.current}
          preview={false}
          onLoad={() => {
            URL.revokeObjectURL(src.current);
          }}
          className="block max-w-full max-h-full absolute inset-0 "
        />
      </div>
    </div>
  );
}

const ImagePreview = memo(InternalImage);
export default ImagePreview;
