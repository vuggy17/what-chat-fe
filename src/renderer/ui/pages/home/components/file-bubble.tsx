/* eslint-disable import/no-cycle */
import React from 'react';
import { FileOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { MessageBubbleProps } from './chat-bubble';

type FileBubbleProps = MessageBubbleProps & {
  uploaded: boolean;
  name: string;
  size: number;
};

export default function FileBubble({ ...props }: FileBubbleProps) {
  return (
    <div className="flex gap-4 items-center justify-center bg-white shadow-sm  max-w-[300px] rounded-md px-3 py-5 ">
      <span>
        <FileOutlined style={{ fontSize: '1.2rem' }} />
      </span>
      <Typography.Text ellipsis>{props.name}</Typography.Text>
    </div>
  );
}
