/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
import { UserOutlined } from '@ant-design/icons';
import { Avatar, message, Tooltip, Typography } from 'antd';
import React from 'react';
import formatDTime from 'renderer/utils/time';
import IUser from 'renderer/domain/user.entity';
import FileBubble from './file-bubble';
import { CircleChecked } from './icons';
import ImageBubble from './image-bubble';
import BubbleActionMenu from './context-menu';

/* eslint-disable react/require-default-props */
export interface MessageBubbleProps {
  self: boolean;
  type: MessageType;
  content: any;
  path?: string;
  name?: string;
  size?: number;
  sender: IUser;
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
  const { self, type, content, time, ...messageMeta } = props;

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
              <ImageBubble uploaded={messageMeta.uploaded!} {...props} />
            </BubbleActionMenu>
          );
        default:
          return (
            <div className="flex">
              <div className="bg-primary text-white break-words rounded-md rounded-br-none pt-3 pl-4 pr-3 pb-0  ">
                <BubbleActionMenu actions={['delete']} msg={props}>
                  <Typography.Paragraph className="text-inherit">
                    {content}
                  </Typography.Paragraph>
                </BubbleActionMenu>
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
        <Tooltip
          title={formatDTime(time.toString())}
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
          <BubbleActionMenu actions={['edit', 'delete']} msg={props}>
            <ImageBubble uploaded={messageMeta.uploaded!} {...props} />
          </BubbleActionMenu>
        );
      default:
        return (
          <div className="bg-[#EBEBEB] break-words  rounded-md rounded-bl-none p-3 pb-0">
            <BubbleActionMenu actions={['delete']} msg={props}>
              <Typography.Paragraph>{content}</Typography.Paragraph>
            </BubbleActionMenu>
          </div>
        );
    }
  };
  // TODO: get user avar from userManager with props.sender
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
      <Tooltip title={formatDTime(time.toString())} placement="left">
        {othersMessage()}
      </Tooltip>
    </div>
  );
}
