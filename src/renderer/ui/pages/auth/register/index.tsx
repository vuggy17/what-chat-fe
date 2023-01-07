/* eslint-disable react/jsx-props-no-spreading */

import React, { FormEventHandler, SyntheticEvent } from 'react';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, message, Space, Typography, Upload, UploadProps } from 'antd';
import { LOGIN } from 'renderer/shared/constants';
import RegisterForm from './registerform';

export default function Register() {
  const navigate = useNavigate();
  return (
    <div className=" py-7 h-screen flex w-full items-center justify-center">
      <div className="mx-4 w-full max-w-lg  overflow-auto ">
        <div className="bg-white rounded border pt-[38px] pb-[48px] px-11 text-left ">
          <div className="mb-4">
            <ArrowLeftOutlined
              style={{ fontSize: 18 }}
              className="button-hover cursor-pointer hover:text-orange-500 transition duration-200"
              onClick={(e: any) => {
                navigate(LOGIN);
              }}
            />
          </div>
          <Space direction="vertical" size="large" className="w-full">
            <Space direction="vertical">
              <Typography.Title
                level={3}
                className="mt-0"
                style={{
                  marginBottom: 0,
                }}
              >
                Register for an account
              </Typography.Title>

              <Typography.Text type="secondary">
                Enter your credential to start chating
              </Typography.Text>
            </Space>
            <RegisterForm />
          </Space>
        </div>
      </div>
    </div>
  );
}
