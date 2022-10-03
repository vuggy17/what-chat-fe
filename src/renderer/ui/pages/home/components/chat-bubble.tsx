/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Tooltip, Typography } from 'antd';
import React from 'react';
import formatDTime from 'renderer/utils/time';
import FileBubble from './file-bubble';
import { CircleChecked } from './icons';
import ImageBubble from './image-bubble';
import BubbleActionRightClickContext from './rightclick-menu';

/* eslint-disable react/require-default-props */
export interface MessageBubbleProps {
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
}

export default function MessageBubble({
  hasAvatar = false,
  ...props
}: MessageBubbleProps) {
  const { self, type, content, time, ...rest } = props;

  if (self) {
    const selfMessage = () => {
      switch (type) {
        case 'file':
          return (
            <BubbleActionRightClickContext
              actions={['delete']}
              chatId={rest.chatId}
              messageId={rest.id}
            >
              <FileBubble
                uploaded={rest.uploaded!}
                name={rest.name!}
                size={rest.size!}
                {...props}
              />
            </BubbleActionRightClickContext>
          );
        case 'photo':
          return (
            <BubbleActionRightClickContext
              actions={['delete', 'edit']}
              chatId={rest.chatId}
              messageId={rest.id}
            >
              <ImageBubble uploaded={rest.uploaded!} {...props} />
            </BubbleActionRightClickContext>
          );
        default:
          return (
            <div className="flex">
              <div className="bg-primary text-white break-words rounded-md rounded-br-none pt-3 pl-4 pr-1 pb-0  ">
                <BubbleActionRightClickContext
                  actions={['delete']}
                  chatId={rest.chatId}
                  messageId={rest.id}
                >
                  <Typography.Paragraph className="text-inherit">
                    {content}
                  </Typography.Paragraph>
                </BubbleActionRightClickContext>
              </div>
              <div className="invisible">
                <CircleChecked />
              </div>
            </div>
          );
      }
    };
    return (
      // self message
      <div className=" mr-3 float-right flex max-w-[90%] mb-3">
        <div className="invisible">action menu</div>
        <Tooltip title={formatDTime(time.toString())} placement="left">
          {selfMessage()}
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

  // others message
  const othersMessage = () => {
    switch (type) {
      case 'file':
        return (
          <BubbleActionRightClickContext
            actions={['delete']}
            chatId={rest.chatId}
            messageId={rest.id}
          >
            <FileBubble
              uploaded={rest.uploaded!}
              name={rest.name!}
              size={rest.size!}
              {...props}
            />
          </BubbleActionRightClickContext>
        );
      case 'photo':
        return (
          <BubbleActionRightClickContext
            actions={['edit', 'delete']}
            chatId={rest.chatId}
            messageId={rest.id}
          >
            <ImageBubble uploaded={rest.uploaded!} {...props} />
          </BubbleActionRightClickContext>
        );
      default:
        return (
          <div className="bg-[#EBEBEB] break-words  rounded-md rounded-bl-none p-3 pb-0">
            <BubbleActionRightClickContext
              actions={['delete']}
              chatId={rest.chatId}
              messageId={rest.id}
            >
              <Typography.Paragraph>{content}</Typography.Paragraph>
            </BubbleActionRightClickContext>
          </div>
        );
    }
  };

  return (
    <div className="max-w-[90%] flex clear-right mb-3">
      <div
        className="flex-shrink-0 pr-2 pb-1 self-end"
        style={{ visibility: hasAvatar ? 'visible' : 'hidden' }}
      >
        <Avatar shape="circle" icon={<UserOutlined />} />
      </div>
      <Tooltip title={formatDTime(time.toString())} placement="left">
        {othersMessage()}
      </Tooltip>

      <div className="invisible">action menu</div>
    </div>
  );
}
