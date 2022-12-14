import Icon, {
  AudioFilled,
  FileImageOutlined,
  FileOutlined,
  PaperClipOutlined,
  SmileOutlined,
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
  message,
  Dropdown,
  ConfigProvider,
} from 'antd';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  EmojiObject,
  EmojiPicker,
  unifiedToNative,
} from 'react-twemoji-picker';
import EmojiData from 'react-twemoji-picker/data/twemoji.json';
import ImagePreview from './image-preview';
import { ReactComponent as SendIcon } from '../../../../../../assets/icons/send.svg';
import 'react-twemoji-picker/dist/EmojiPicker.css';

const emojiData = Object.freeze(EmojiData);

export default function Input({
  ...props
}: {
  onSubmit(
    type: 'file' | 'photo' | 'text',
    text?: string,
    attachments?: File[]
  ): void;
  onFocus(): void;
  onSendGroupMessage(
    type: 'file' | 'photo' | 'text',
    text?: string,
    attachments?: File[]
  ): void;
  isGroup: boolean;
}) {
  const inputRef = useRef<InputRef>(null);
  const [fileRef, setFileRef] = useState<File[] | undefined>(undefined);
  const [textContent, setContent] = React.useState('');
  const [imNotImage, setImNotImage] = useState(false);

  const addNewLineToTextArea = () => {
    const msgText = `${textContent}\r\n`;
    setContent(msgText);
  };

  const handleEmojiSelect = (emoji: EmojiObject) => {
    setContent(textContent + unifiedToNative(emoji.unicode));
  };

  const sendMessage = () => {
    const hasFile = fileRef !== undefined && fileRef?.length > 0;
    const hasText = textContent.trim().length > 0;

    if (hasFile && imNotImage) {
      props.onSubmit('file', textContent, fileRef);
      setContent('');
      setFileRef(undefined);
      return;
    }

    // if we have a file with description
    if (hasFile && hasText) {
      props.onSubmit('photo', textContent, fileRef);
    }
    // or file only
    if (hasFile && !hasText) {
      props.onSubmit('photo', '', fileRef);
    }

    // or text only
    if (!hasFile && hasText) {
      props.onSubmit('text', textContent);
    }

    setContent('');
    setFileRef(undefined);
  };

  const sendGroupMessage = () => {
    const hasFile = fileRef !== undefined && fileRef?.length > 0;
    const hasText = textContent.trim().length > 0;

    if (hasFile && imNotImage) {
      props.onSendGroupMessage('file', textContent, fileRef);
      setContent('');
      setFileRef(undefined);
      return;
    }

    if (hasFile && hasText) {
      props.onSendGroupMessage('photo', textContent, fileRef);
    }
    // or file only
    if (hasFile && !hasText) {
      props.onSendGroupMessage('photo', '', fileRef);
    }

    // or text only
    if (!hasFile && hasText) {
      props.onSendGroupMessage('text', textContent);
    }

    setContent('');
    setFileRef(undefined);
  };
  const handleKeyPress: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      addNewLineToTextArea();
    }
  };

  function isFileImage(file: File) {
    return file && file.type.split('/')[0] === 'image';
  }

  const handleSendFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files?.length > 0) {
      const fileArray = Array.from(files);
      if (isFileImage(files[0])) {
        setFileRef(fileArray);
      } else {
        setFileRef(fileArray);
        // message.info('Only image files are allowed');
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

  useEffect(() => {
    if (fileRef !== undefined && fileRef?.length > 0) {
      // const file = fileRef[0];
      // const isImage = file.type.startsWith('image/');
      // if (!isImage) {
      //   setImNotImage(true);
      // }

      if (imNotImage) {
        if (props.isGroup) {
          sendGroupMessage();
        } else {
          sendMessage();
        }
        setImNotImage(false);
      }
    }
  }, [fileRef]);

  return (
    <div className="bg-white">
      <Divider className="my-0 mb-2" />
      <div className="flex pb-1 pl-1">
        {/* <Tooltip title="Record a Voice Clip">
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
              // accept="image/*"
              // onChange={handleSendFile}
            />
          </label>
        </Tooltip> */}
        <Tooltip title="Upload file">
          <label
            htmlFor="chat-input-file"
            className="flex items-center justify-center  "
          >
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                setImNotImage(true);
                document.getElementById('chat-input-file')?.click();
              }}
              type="text"
              icon={<PaperClipOutlined className="scale-125" />}
            />
            <input
              id="chat-input-file"
              type="file"
              hidden
              multiple={false}
              accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
              onChange={(e: any) => {
                handleSendFile(e);
              }}
            />
          </label>
        </Tooltip>

        <Tooltip title="Upload Image">
          <label
            htmlFor="chat-input-image"
            className="flex items-center justify-center  "
          >
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                document.getElementById('chat-input-image')?.click();
              }}
              type="text"
              icon={<FileImageOutlined className="scale-125" />}
            />
            <input
              id="chat-input-image"
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleSendFile}
            />
          </label>
        </Tooltip>

        <Tooltip title="Choose emoji">
          <Dropdown
            className="no-padding"
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 1,
                  label: (
                    <EmojiPicker
                      numberScrollRows={9}
                      theme="light"
                      emojiData={emojiData}
                      onEmojiSelect={handleEmojiSelect}
                      // showNavbar
                    />
                  ),
                },
              ],
            }}
            placement="topRight"
          >
            <Button type="text" icon={<SmileOutlined />} />
          </Dropdown>
        </Tooltip>
      </div>
      <Divider className="my-0" />
      <div>
        <Row>
          <Col span={22}>
            {fileRef && !imNotImage && (
              <ul className="flex p-0 m-0 px-2 space-x-1 list-none  preview-scroll">
                {fileRef.map((file) => (
                  <li
                    className="w-20 h-20 overflow-hidden shrink-0 rounded-md"
                    key={file.path}
                  >
                    <ImagePreview
                      key={file.path}
                      file={file}
                      onClose={() =>
                        setFileRef((prev) =>
                          prev?.filter((f) => {
                            return file.name !== f.name;
                          })
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </Col>
        </Row>
        <Row className="py-3" align="middle" justify="end">
          <Col flex={1}>
            <AntInput.TextArea
              onPressEnter={(e) => {
                e.preventDefault(); // prevent new line from being added
                if (props.isGroup) {
                  sendGroupMessage();
                } else {
                  sendMessage();
                }
              }}
              onKeyDown={handleKeyPress}
              ref={inputRef}
              className="w-full"
              bordered={false}
              value={textContent}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a message "
              autoSize={{ minRows: 1, maxRows: 5 }}
            />
          </Col>
          <Col span={2}>
            <Tooltip title="Send message" placement="leftTop">
              <Button
                className="mx-auto table group"
                type="text"
                onClick={() => {
                  if (props.isGroup) {
                    sendGroupMessage();
                  } else {
                    sendMessage();
                  }
                }}
                icon={
                  <Icon
                    component={SendIcon}
                    style={{
                      color: textContent ? '#D1E4E8' : '',
                      rotate: textContent ? '0deg' : '45deg',
                    }}
                    size={48}
                    className="transition-all group-hover:text-[#D1E4E8] duration-150 text-white text-xl transform "
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
