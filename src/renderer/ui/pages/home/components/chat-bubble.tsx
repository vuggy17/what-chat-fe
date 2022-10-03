/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Tooltip, Typography } from 'antd';
import React from 'react';
import formatDTime from 'renderer/utils/time';
import FileBubble from './file-bubble';
import ImageBubble from './image-bubble';

/* eslint-disable react/require-default-props */
export type MessageBubbleProps = {
  self: boolean;
  type: MessageType;
  content: any;
  path?: string;
  name?: string;
  size?: number;
  time: Date;
  hasAvatar?: boolean;
  uploaded?: boolean;
  chatId: Id;
  id: Id;
};

export default function MessageBubble({
  hasAvatar = false,
  ...props
}: MessageBubbleProps) {
  const { self, type, content, time, ...rest } = props;

  if (self) {
    const itemContent = () => {
      switch (type) {
        case 'file':
          return (
            <FileBubble
              uploaded={rest.uploaded!}
              name={rest.name!}
              size={rest.size!}
              {...props}
            />
          );
        case 'photo':
          return <ImageBubble uploaded={rest.uploaded!} {...props} />;
        default:
          return (
            <div className="bg-primary text-white break-words rounded-md rounded-br-none p-3 pb-0  ">
              <Typography.Paragraph style={{ color: 'white' }}>
                {content}
              </Typography.Paragraph>
            </div>
          );
      }
    };
    return (
      // self message
      <div className=" mr-3 float-right flex max-w-[90%] mb-3">
        <div className="invisible">action menu</div>
        <Tooltip title={formatDTime(time.toString())} placement="left">
          {itemContent()}
        </Tooltip>
        <div
          className="flex-shrink-0 px-2 self-end hidden" // message from self should not have avatar
          // style={{ visibility: hasAvatar ? 'visible' : 'hidden' }}
        >
          <Avatar shape="circle" />
        </div>
      </div>
    );
  }
  return (
    <div className=" max-w-[90%] flex clear-right mb-3">
      <div
        className="flex-shrink-0 pr-2 pb-1 self-end"
        style={{ visibility: hasAvatar ? 'visible' : 'hidden' }}
      >
        <Avatar shape="circle" icon={<UserOutlined />} />
      </div>
      <Tooltip title={formatDTime(time.toString())} placement="left">
        <div className="bg-[#EBEBEB] break-words max-w-[90%] rounded-md rounded-bl-none p-3 pb-0">
          <Typography.Paragraph>{content}</Typography.Paragraph>
        </div>
      </Tooltip>

      <div className="invisible">action menu</div>
    </div>
  );
}

// const MemorizedMessageBubble = React.memo(MessageBubble);

// export default MemorizedMessageBubble;
