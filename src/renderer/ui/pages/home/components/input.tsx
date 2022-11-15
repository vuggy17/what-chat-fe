/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { PaperClipOutlined, SendOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import React, { ChangeEvent, useEffect, useRef } from 'react';

export default function Input({
  ...props
}: {
  onSubmit(content: string | File, type: 'file' | 'photo' | 'text'): void;
  onFocus(): void;
}) {
  const inputRef = useRef<any>();

  const reset = () => {
    inputRef.current.innerHTML = '';
  };

  const handleSend = (v: string) => {
    if (v && v.trim().length > 0) {
      props.onSubmit(v, 'text');
    }
    reset();
  };

  const handleEnter = (e: any) => {
    const value = inputRef.current.textContent;
    if (e.key === 'Enter' && Boolean(value)) {
      handleSend(value);
    }
    if (e.which === 13) e.preventDefault();
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

  const onPaste = (e: any) => {
    e.preventDefault();
    const clipboard = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, clipboard);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('paste', onPaste);
    }
    return () => {
      const cp = inputRef;
      if (cp.current) {
        cp.current.removeEventListener('paste', onPaste);
      }
    };
  }, []);

  return (
    <div
      className="w-full py-2 overscroll-contain inline-flex  items-center bg-gray-2 rounded-md input-wrapper "
      style={{ bottom: 0 }}
    >
      {/* input */}
      <div
        className="flex items-center flex-1 "
        onSubmit={handleEnter}
        onFocus={() => props.onFocus()}
      >
        <div
          ref={inputRef}
          className="input-pl grow overflow-y-auto leading-relaxed text-neutral-900  px-2 pl-3 py-2 break-words max-h-[150px] focus:outline-none font-normal text-sm"
          contentEditable
          placeholder="Type your message...."
          onKeyDown={handleEnter}
        />
      </div>
      <Tooltip title="Open file">
        <label
          htmlFor="chat-input-image"
          className="flex items-center justify-center  font-semibold text-md pl-1 pr-2 hover:text-primary transform duration-300 cursor-pointer"
        >
          <PaperClipOutlined />
          <input
            id="chat-input-image"
            type="file"
            hidden
            // accept="image/*"
            onChange={handleSendFile}
          />
        </label>
      </Tooltip>
      {/* divider */}
      <span className="h-full border-solid  border-0 border-l-[1.5px] border-l-[#8c8c8cd9] mx-2" />
      {/* send button */}
      <div className="min-w-0 ">
        <span
          className="flex items-center justify-center h-10 min-w-0 gap-2 font-semibold text-md ml-1 pr-2 group  cursor-pointer"
          onClick={() => {
            handleSend(inputRef.current.textContext);
          }}
        >
          <Typography.Text className="group-hover:text-primary transition-colors duration-300">
            Send
          </Typography.Text>
          <SendOutlined className="group-hover:text-primary transition-colors duration-300" />
        </span>
      </div>
    </div>
  );
}
