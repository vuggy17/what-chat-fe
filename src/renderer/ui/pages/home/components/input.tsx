import Icon, {
  AudioFilled,
  FileImageOutlined,
  FileOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import {
  Tooltip,
  Input as AntInput,
  InputRef,
  Divider,
  Button,
  Grid,
  Col,
  Row,
} from 'antd';
import React, { ChangeEvent, useRef, useState } from 'react';
import ImagePreview from './image-preview';
import { ReactComponent as SendIcon } from '../../../../../../assets/icons/send.svg';

export default function Input({
  ...props
}: {
  onSubmit(
    type: 'file' | 'photo' | 'text',
    text?: string,
    attachments?: File
  ): void;
  onFocus(): void;
}) {
  const inputRef = useRef<InputRef>(null);
  const [fileRef, setFileRef] = useState<File | null>(null);
  const [textContent, setContent] = React.useState('');

  const addNewLineToTextArea = () => {
    const msgText = `${textContent}\r\n`;
    setContent(msgText);
  };

  const sendMessage = (e: any) => {
    const hasFile = fileRef !== null;
    const hasText = textContent.trim().length > 0;
    // if we have a file with description
    if (hasFile && hasText) {
      props.onSubmit('photo', textContent, fileRef);
    }
    // or file only
    if (hasFile && !hasText) {
      props.onSubmit('photo', '', fileRef);
    }

    // or text only
    if (hasText && !hasFile) {
      props.onSubmit('text', textContent);
    }

    setContent('');
    setFileRef(null);
  };

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (e.shiftKey) addNewLineToTextArea();
    }
  };

  function isFileImage(file: File) {
    return file && file.type.split('/')[0] === 'image';
  }

  const handleSendFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files?.length > 0) {
      const file = files[0];
      if (isFileImage(file)) {
        // props.onSubmit(file, 'photo');
        setFileRef(file);
      } else {
        console.log('not a image file');
        // props.onSubmit(file, 'file');
      }
    }

    // reset input value
    e.target.value = '';
  };

  if (inputRef.current) {
    inputRef.current.focus({
      cursor: 'end',
    });
  }

  return (
    <div className="bg-white">
      <Divider className="my-0 mb-2" />
      <div className="flex gap-1 pb-1 pl-1">
        <Tooltip title="Record a Voice Clip">
          <label
            htmlFor="chat-input-voice"
            className="flex items-center justify-center  font-semibold text-md pl-1 pr-2 hover:text-primary transform duration-300 cursor-pointer w-fit"
          >
            <span>
              <AudioFilled className="scale-125 text-neutral-500" />
            </span>
            <input
              id="chat-input-voice"
              type="file"
              hidden
              accept="image/*"
              onChange={handleSendFile}
            />
          </label>
        </Tooltip>{' '}
        <Tooltip title="Add attachment(s)">
          <label
            htmlFor="chat-input-image"
            className="flex items-center justify-center  font-semibold text-md pl-1 pr-2 hover:text-primary transform duration-300 cursor-pointer w-fit"
          >
            <span>
              <PaperClipOutlined className="scale-125 text-neutral-500" />
            </span>
            <input
              id="chat-input-image"
              type="file"
              hidden
              accept="image/*"
              onChange={handleSendFile}
            />
          </label>
        </Tooltip>
      </div>
      <Divider className="my-0" />
      <div className="pt-2">
        <Row>
          <Col span={22}>
            {fileRef && (
              <ul className="flex p-0 m-0 px-2 space-x-1 list-none  preview-scroll">
                <li className="w-20 h-20 overflow-hidden shrink-0 rounded-md">
                  <ImagePreview
                    file={fileRef}
                    onClose={() => setFileRef(null)}
                  />
                </li>
              </ul>
            )}
          </Col>
        </Row>
        <Row className="py-2" align="middle" justify="end">
          <Col flex={1}>
            <AntInput.TextArea
              size="large"
              onPressEnter={sendMessage}
              onKeyDown={handleKeyPress}
              ref={inputRef}
              className="w-full"
              bordered={false}
              value={textContent}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message "
              autoSize={{ minRows: 1, maxRows: 5 }}
            />
          </Col>
          <Col span={2}>
            <Tooltip title="Send message" placement="leftTop">
              <Button
                className="group mx-auto table"
                type="text"
                onClick={() => {
                  sendMessage(textContent);
                }}
                icon={
                  <Icon
                    component={SendIcon}
                    size={48}
                    className="group-hover:text-primary transition-colors duration-150 text-xl"
                  />
                }
              />
            </Tooltip>
          </Col>
        </Row>
      </div>
    </div>
  );
}
