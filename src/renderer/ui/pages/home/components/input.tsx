import { FileImageOutlined, FileOutlined } from '@ant-design/icons';
import { Tooltip, Input as AntInput, InputRef, Divider, Button } from 'antd';
import React, { ChangeEvent, useRef } from 'react';

export default function Input({
  ...props
}: {
  onSubmit(content: string | File, type: 'file' | 'photo' | 'text'): void;
  onFocus(): void;
}) {
  const inputRef = useRef<InputRef>(null);
  const [textContent, setContent] = React.useState('');

  const addNewLineToTextArea = () => {
    const msgText = `${textContent}\r\n`;
    setContent(msgText);
  };

  const sendMessage = (e: any) => {
    if (textContent.trim().length > 0 && !e.shiftKey) {
      props.onSubmit(textContent, 'text');
      setContent('');
    }
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
        props.onSubmit(file, 'photo');
      } else {
        props.onSubmit(file, 'file');
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
    <div className="bg-white ">
      <Divider className="my-0 mb-2" />
      <div className="flex gap-1 pb-1 pl-1">
        <Tooltip title="Open file">
          <label
            htmlFor="chat-input-file"
            className="flex items-center justify-center font-semibold text-md pl-1 pr-2 hover:text-primary transform duration-300 cursor-pointer w-fit"
          >
            <span>
              <FileOutlined className="scale-125 text-neutral-500" />
            </span>
            <input
              id="chat-input-file"
              type="file"
              hidden
              // accept="image/*"
              onChange={handleSendFile}
            />
          </label>
        </Tooltip>
        <Tooltip title="Open file">
          <label
            htmlFor="chat-input-image"
            className="flex items-center justify-center  font-semibold text-md pl-1 pr-2 hover:text-primary transform duration-300 cursor-pointer w-fit"
          >
            <span>
              <FileImageOutlined className="scale-125 text-neutral-500" />
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
        <table className="w-full">
          <tbody>
            <tr>
              <td colSpan={2}>
                <AntInput.TextArea
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
              </td>
              <td style={{ width: 40, whiteSpace: 'nowrap' }}>
                <div className="min-w-0 ">
                  <Tooltip title="Send message" placement="leftTop">
                    <Button
                      type="text"
                      className="p-2 mr-5 mb-2"
                      onClick={() => {
                        sendMessage(textContent);
                      }}
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="group-hover:text-primary transition-colors duration-300"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#597e8d"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                        </svg>
                      </span>
                    </Button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
