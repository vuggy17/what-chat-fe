/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
import { UserOutlined } from '@ant-design/icons';
import { Avatar, message, Tooltip, Typography } from 'antd';
import React from 'react';
import formatDTime from 'renderer/utils/time';
import User from 'renderer/domain/user.entity';
import FileBubble from './file-bubble';
import { CircleChecked, CircleDashed, CircleSent } from './icons';
import ImageBubble from './image-bubble';
import BubbleActionMenu from './context-menu';

function Indicator({ status }: { status: MessageStatus }) {
  switch (status) {
    case 'sending':
      return <CircleDashed classname="scale-[0.9] ml-1 -mr-1" />;
    case 'sent':
      return (
        <CircleSent
          color="white"
          background="#4b5563"
          classname="scale-[0.9] ml-1 -mr-1"
        />
      );
    case 'received':
      return (
        <CircleChecked
          color="white"
          background="#4b5563"
          classname="scale-[0.9] ml-1 -mr-1"
        />
      );
    default:
      return null;
  }
}
/* eslint-disable react/require-default-props */
export interface MessageBubbleProps {
  self: boolean;
  type: MessageType;
  text: string;
  attachments?: any;
  path?: string;
  name?: string;
  size?: number;
  sender: User | any;
  time: number;
  hasAvatar?: boolean;
  uploaded?: boolean;
  chatId: Id | null;
  id: Id;
  status: MessageStatus;
}

export default function MessageBubble({
  hasAvatar = false,
  ...props
}: MessageBubbleProps) {
  const { self, type, text, attachments, time, status, ...messageMeta } = props;
  if (self) {
    const selfMessage = () => {
      switch (type) {
        case 'file':
          return (
            <BubbleActionMenu actions={['download', 'delete']} msg={props}>
              <FileBubble
                uploaded={messageMeta.uploaded!}
                name={messageMeta.name!}
                size={messageMeta.size!}
                {...props}
              />
            </BubbleActionMenu>
          );
        case 'photo':
          return (
            <BubbleActionMenu
              actions={['download', 'edit', 'delete']}
              msg={props}
            >
              <ImageBubble
                uploaded={messageMeta.uploaded!}
                indicator={<Indicator status={status} />}
                {...props}
              />
            </BubbleActionMenu>
          );
        default:
          return (
            <div className="flex">
              <div className="bg-primary text-white break-words rounded-md rounded-br-none pt-3 pl-4 pr-3 pb-0  ">
                <BubbleActionMenu actions={['delete']} msg={props}>
                  <Typography.Paragraph className="text-inherit">
                    {text}
                  </Typography.Paragraph>
                </BubbleActionMenu>
              </div>
              <div className="flex items-end">
                <Indicator status={status} />
              </div>
            </div>
          );
      }
    };
    return (
      // self message
      <div className=" mr-[6px] float-right flex max-w-[90%] mb-3">
        <Tooltip
          title={formatDTime(time)}
          placement="left"
          mouseEnterDelay={0.5}
        >
          {selfMessage()}
          <div
            className="flex-shrink-0 px-2 self-end hidden" // message from self should not have avatar
            // style={{ visibility: hasAvatar ? 'visible' : 'hidden' }}
          >
            <Avatar shape="circle" />
          </div>
        </Tooltip>
      </div>
    );
  }

  // others message
  const othersMessage = () => {
    switch (type) {
      case 'file':
        return (
          <BubbleActionMenu actions={['delete']} msg={props}>
            <FileBubble
              uploaded={messageMeta.uploaded!}
              name={messageMeta.name!}
              size={messageMeta.size!}
              {...props}
            />
          </BubbleActionMenu>
        );
      case 'photo':
        return (
          <BubbleActionMenu
            actions={['download', 'edit', 'delete']}
            msg={props}
          >
            <ImageBubble uploaded={messageMeta.uploaded!} {...props} />
          </BubbleActionMenu>
        );
      default:
        return (
          <div className="bg-[#EBEBEB] break-words  rounded-md rounded-bl-none p-3 pb-0">
            <BubbleActionMenu actions={['delete']} msg={props}>
              <Typography.Paragraph>{text}</Typography.Paragraph>
            </BubbleActionMenu>
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
        <Avatar
          shape="circle"
          icon={<UserOutlined />}
          src={props.sender?.avatar}
        />
      </div>
      <Tooltip title={formatDTime(time)} placement="left">
        {othersMessage()}
      </Tooltip>
    </div>
  );
}
