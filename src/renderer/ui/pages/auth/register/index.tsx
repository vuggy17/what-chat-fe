/* eslint-disable react/jsx-props-no-spreading */

import React, { FormEventHandler, SyntheticEvent } from 'react';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, message, Upload, UploadProps } from 'antd';
import { LOGIN } from 'renderer/shared/constants';
import RegisterForm from './registerform';

export default function Register() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center grow py-7 ">
      <div className=" w-[768px]  overflow-auto ">
        <div className=" bg-white rounded border pt-[38px] pb-[48px] px-11 text-left ">
          <div className="mb-4">
            <ArrowLeftOutlined
              style={{ fontSize: 18 }}
              className="button-hover cursor-pointer hover:text-orange-500 transition duration-200"
              onClick={(e: any) => {
                navigate(LOGIN);
              }}
            />
          </div>
          <h2 className="font-bold text-2xl mb-2">Register for an account</h2>
          <p className="text-sm text-stone-600 mb-7">
            Enter your credential to start chating <br />
          </p>

          <RegisterForm />
          {/* <p className="font-bold text-xs tracking-wide mb-5">
            -- Or Sign in with --{" "}
          </p>

          <div className="flex space-x-1 justify-center">
            <Button>
              <div className="flex items-center gap-1">
                <img src="google.svg" width="24" />
                Google
              </div>
            </Button>
            <Button>
              <div className="flex items-center gap-1">
                <img src="facebook.svg" width="24" />
                Facebook
              </div>
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
