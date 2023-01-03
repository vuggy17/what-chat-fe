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
import { MessageBubbleProps } from './type';

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
      return (
        <CircleSent
          color="white"
          background="#4b5563"
          classname="scale-[0.9] ml-1 "
        />
      );
  }
}
/* eslint-disable react/require-default-props */

export default function MessageBubble({
  hasAvatar = true,
  ...props
}: MessageBubbleProps) {
  const { self, type, text, attachments, time, status, ...messageMeta } = props;
  // Set default value for status to sent
  const messageStatus = status || 'sent';
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
                className="bg-primary rounded w-fit  rounded-br-none text-white max-w-[60%] float-right"
                description={
                  text && (
                    <div className="break-words py-1 pl-2 pr-3">
                      <Typography.Paragraph className="text-inherit mb-0 no-margin">
                        {text}
                      </Typography.Paragraph>
                    </div>
                  )
                }
                attachments={attachments}
                attachmentsMeta={messageMeta.attachmentsMeta}
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
              className="bg-[#EBEBEB] rounded rounded-bl-none w-fit max-w-[60%] "
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
      className="flex mt-1 min-w-0 "
      style={{ flexDirection: self ? 'row-reverse' : 'row' }}
    >
      {messageStatus && (
        <div className="flex flex-col ">
          <div className="grow flex flex-col justify-end">
            <Indicator status={messageStatus} />
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
