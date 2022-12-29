import { Button, Form, Image, Input, Space, Typography } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentUser } from 'renderer/hooks/use-user';
import SocketClient from 'renderer/services/socket';
import { APP, REGISTER } from 'renderer/shared/constants';
import loginbg from '../../../../../../assets/login-bg.png';

function Login() {
  const navigate = useNavigate();
  const [user, setCurrentUser] = useRecoilState(currentUser);
  // const resetList = useResetRecoilState(chatIdsState);

  const handleSubmit = (values) => {
    const { username, password } = values;
    axios
      .post('/user/login', { username, password })
      .then((res) => {
        setCurrentUser(res.data.data);
        SocketClient.setup();
        navigate(`/${APP}`);
        return null;
      })
      .catch((err) => console.error('cant login'));
  };

  useEffect(() => {
    if (user) {
      navigate(`/${APP}`);
    }
  }, []);

  return (
    <div className="bg-white grid grid-cols-[1fr_0.8fr] grid-flow-row w-screen h-screen ">
      <div className="relative login-left">
        <div className="absolute top-[75%] left-0 right-0 bottom-0 pl-20 bg-linear-black">
          <div>
            <Typography.Title
              style={{
                color: 'white',
              }}
              level={2}
            >
              Welcome to{' '}
              <span
                className="text-gradient"
                style={{
                  display: 'inline',
                }}
              >
                WhatChat
              </span>
            </Typography.Title>
            <Typography.Text className="text-2xl text-white">
              Go straight to talk with your
              <span
                className="text-2xl text-gradient"
                style={{
                  color: '#D1E4E8',
                }}
              >
                {' '}
                fellows
              </span>
            </Typography.Text>
          </div>
        </div>
      </div>
      <div className="w-2/3 mx-auto text-center place-self-center">
        <Typography.Title level={3}>WhatChat login</Typography.Title>
        <Typography.Text type="secondary">
          Enter your credential to get sign in <br />
          to your account
        </Typography.Text>

        <Form
          className="pt-4"
          size="large"
          wrapperCol={{ offset: 2, span: 20 }}
          initialValues={{
            remember: true,
            username: 'PhiCường10',
            password: 'cUMWqiKC2TauoH7',
          }}
          onFinish={handleSubmit}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Passcode" />
          </Form.Item>

          <Form.Item className="pt-4">
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>

        <Space>
          <Button
            className="mx-3 "
            type="primary"
            onClick={() => {
              axios
                .post('/user/login', {
                  username: 'TâmLinh.Lý',
                  password: 'HVRzASZ35rZNU1o',
                })
                .then((res) => {
                  setCurrentUser(res.data.data);

                  SocketClient.setup();
                  navigate(`/${APP}`);
                  return null;
                })
                .catch((err) => console.error('cant login'));
            }}
          >
            Hiểu
          </Button>
          <Button
            type="primary"
            onClick={() => {
              axios
                .post('/user/login', {
                  username: 'PhiCường10',
                  password: 'cUMWqiKC2TauoH7',
                })
                .then((res) => {
                  setCurrentUser(res.data.data);

                  SocketClient.setup();
                  navigate(`/${APP}`);

                  return null;
                })
                .catch((err) => console.error('cant login'));
            }}
          >
            Thiên
          </Button>
        </Space>
        <br />
        <br />
        <br />
        <br />
        <Space>
          <Typography.Text type="secondary">
            Don't have account yet?
          </Typography.Text>
          <Typography.Link strong to={`/${REGISTER}`}>
            Sign up
          </Typography.Link>
        </Space>
      </div>
    </div>
  );
}

export default Login;
