/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
import { UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Col,
  ConfigProvider,
  message,
  Row,
  Tooltip,
  Typography,
} from 'antd';
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
      return <CircleDashed classname="scale-[0.9] ml-1 " />;
    case 'sent':
      return (
        <CircleSent
          color="white"
          background="#4b5563"
          classname="scale-[0.9] ml-1 "
        />
      );
    case 'received':
      return (
        <CircleChecked
          color="white"
          background="#4b5563"
          classname="scale-[0.9] ml-1 "
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
  localPath?: string;
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

function MessageBubble1({ hasAvatar = false, ...props }: MessageBubbleProps) {
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
              <ImageBubble {...props} />
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

export default function MessageBubble({
  hasAvatar = false,
  ...props
}: MessageBubbleProps) {
  const { self, type, text, attachments, time, status, ...messageMeta } = props;

  const messageContent = () => {
    if (self) {
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
                className="bg-primary rounded h-[300px]  w-fit  rounded-br-none overflow-hidden text-white max-w-[60%] float-right"
                description={
                  text && (
                    <div className="break-words py-1 pl-2 pr-3">
                      <Typography.Paragraph className="text-inherit mb-0 no-margin">
                        {text}
                      </Typography.Paragraph>
                    </div>
                  )
                }
                {...props}
              />
            </BubbleActionMenu>
          );
        default:
          return (
            <div className="bg-primary w-fit float-right text-white break-words rounded-md rounded-br-none py-2 pl-4 pr-3  ">
              <BubbleActionMenu actions={['delete']} msg={props}>
                <Typography.Paragraph className="text-inherit no-margin">
                  {text}
                </Typography.Paragraph>
              </BubbleActionMenu>
            </div>
          );
      }
    }

    // others message
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
      // case 'photo':
      //   return (
      //     <BubbleActionMenu
      //       actions={['download', 'edit', 'delete']}
      //       msg={props}
      //     >
      //       <ImageBubble
      //         {...props}
      //         description={
      //           text && (
      //             <BubbleActionMenu actions={['delete']} msg={props}>
      //               <div className="break-words py-1 pl-2 pr-3 bg-[#EBEBEB]  ">
      //                 <Typography.Paragraph className="text-inherit mb-0 no-margin">
      //                   {text}
      //                 </Typography.Paragraph>
      //               </div>
      //             </BubbleActionMenu>
      //           )
      //         }
      //       />
      //     </BubbleActionMenu>
      //   );
      case 'photo':
        return (
          <BubbleActionMenu
            actions={['download', 'edit', 'delete']}
            msg={props}
          >
            <ImageBubble
              className="bg-[#EBEBEB] h-[300px] rounded rounded-bl-none w-fit overflow-hidden max-w-[60%] "
              description={
                text && (
                  <div className="break-words py-1 pl-2 pr-3   ">
                    <Typography.Paragraph className="text-inherit mb-0 no-margin">
                      {text}
                    </Typography.Paragraph>
                  </div>
                )
              }
              {...props}
            />
          </BubbleActionMenu>
        );
      default:
        return (
          <BubbleActionMenu actions={['delete']} msg={props}>
            <div className="bg-[#EBEBEB] w-fit break-words rounded-md rounded-bl-none pl-3 py-2 pr-4">
              <Typography.Paragraph className="no-margin">
                {text}
              </Typography.Paragraph>
            </div>
          </BubbleActionMenu>
        );
    }
  };

  return (
    <div
      className="flex mb-1 min-w-0 "
      style={{ flexDirection: self ? 'row-reverse' : 'row' }}
    >
      {status && (
        <div className="flex flex-col ">
          <div className="grow flex flex-col justify-end">
            <Indicator status={status} />
          </div>
        </div>
      )}
      {/* message content */}
      <div className="text-left flex-1 min-w-0 ">{messageContent()}</div>
      {/* message status */}

      <div className="w-[10%] shrink-0" />
    </div>
  );
}
