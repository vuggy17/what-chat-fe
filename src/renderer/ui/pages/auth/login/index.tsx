import { Button, Form, Input } from 'antd';
import React, { BaseSyntheticEvent } from 'react';
// import { AuthProvider, useAuth } from '@contexts';

import { Link, useNavigate } from 'react-router-dom';
import { CHAT, REGISTER } from 'renderer/shared/constants';
import sapiens from '../../../../../../assets/sapiens.svg';

function Login() {
  const navigate = useNavigate();
  const handleSubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
  };

  return (
    <div className=" flex items-center justify-center h-screen w-screen">
      <div className="bg-amber-50 flex flex-col  md:flex-row items-center justify-center p-16 rounded">
        <img src={sapiens} alt="" className="sm:w-1/2 md:w-[40%]" />
        <div className="bg-white w-full rounded-3xl border sm:w-2/3 md:w-[480px] pt-[58px] pb-[48px] text-center">
          <h2 className="font-bold text-3xl rounded text-center mb-2 mt-8 tracking-wide text-orange-600">
            WhatChat login
          </h2>

          <p className="text-sm text-stone-600 mb-7">
            Enter your credential to get sign in <br />
            to your account
          </p>

          <Form
            size="large"
            wrapperCol={{ offset: 2, span: 20 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder="Passcode" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
          <p className="font-bold text-xs tracking-wide mb-5 ">
            -- Or
            <Link to={REGISTER} className="text-orange-600 m-1">
              register
            </Link>
            for an account --
          </p>
          <Button
            type="primary"
            block
            onClick={() => {
              navigate(`/${CHAT}`);
            }}
          >
            go chat
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
