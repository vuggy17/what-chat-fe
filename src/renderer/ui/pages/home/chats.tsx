/* eslint-disable react/button-has-type */
import {
  ApiOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  SmileOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Divider,
  Layout,
  Menu,
  message,
  Tooltip,
  Typography,
} from 'antd';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  useRecoilCallback,
  useRecoilState,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { currentUser } from 'renderer/hooks/use-user';
import {
  CHAT,
  C_CONVERSATION,
  C_FRIEND,
  C_PROFILE,
  LOGIN,
  REGISTER,
} from 'renderer/shared/constants';
import logo from '../../../../../assets/logo.png';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// use this for debugging purpose only
// TODO: remove this
function DebugButton() {
  const onClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        console.debug('Atom values:');
        // eslint-disable-next-line no-restricted-syntax
        for (const node of snapshot.getNodes_UNSTABLE()) {
          // eslint-disable-next-line no-await-in-loop
          const value = await snapshot.getPromise(node);
          console.debug(node.key, value);
        }
      },
    []
  );

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <Button
      onClick={() => {
        axios
          .get('chat/messages?channelId=6369bf85fc711638f3b40257&offset=0')
          .then((res) => console.log(res.data))
          .catch((err) => console.error('err', err));
      }}
    >
      get messagese
    </Button>
  );
}

const Chats: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const [user, setCurrentUser] = useRecoilState(currentUser);
  useEffect(() => {
    if (!user) {
      (async () => {
        axios
          .post('/user/login', {
            username: 'Karl_Jones',
            password: '44lwA5KFn15pNCk',
          })
          .then((res) => {
            message.success('Login success');
            setCurrentUser(res.data.data);
            return null;
          })
          .catch((err) => console.error('error', err));
      })();
    }
  }, []);

  return (
    <Layout style={{ height: '100vh', overflow: 'auto' }}>
      <Sider
        trigger={null}
        // breakpoint="xl"
        collapsible
        // onBreakpoint={setCollapsed}
        collapsed={collapsed}
        defaultCollapsed
        theme="light"
        className="px-4"
        // width={!collapsed ? 220 : ''}
      >
        <div className="flex flex-col flex-1 h-full justify-between ">
          <div>
            <div
              className=" m-[16px] ml-0 w-full flex items-center"
              style={{ justifyContent: collapsed ? 'center' : undefined }}
            >
              <img src={logo} alt="logo" className="w-[32px]" />
              {!collapsed && (
                <p className="font-semibold duration-300 transition-opacity  text-green-700 ml-3 mb-0">
                  Tailwind
                </p>
              )}
            </div>
            <Menu
              tabIndex="-1" // disable keyboard navigation
              theme="light"
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ borderRight: 'none' }}
              items={[
                {
                  key: '1',
                  icon: <MessageOutlined />,
                  label: 'Conversations',
                  onClick: () => {
                    navigate(`${C_CONVERSATION}`);
                  },
                },
                {
                  key: '2',
                  icon: <SmileOutlined />,
                  label: 'Friends',
                  onClick: () => {
                    navigate(`${C_FRIEND}`);
                  },
                },
                {
                  key: '3',
                  icon: <UserOutlined />,
                  label: 'My profile',
                  onClick: () => {
                    navigate(`${C_PROFILE}`);
                  },
                },
              ]}
            />
          </div>
          <div className="flex justify-center pb-1">
            <Tooltip title="Logout" placement="right">
              <Button
                icon={<ApiOutlined />}
                block
                ghost
                danger
                onClick={() => {
                  navigate(`/${LOGIN}`);
                }}
              >
                {!collapsed && 'Logout'}
              </Button>
            </Tooltip>
          </div>
        </div>
      </Sider>

      <Layout className="site-layout h-full">
        <Header
          className="bg-white"
          style={{ paddingRight: 28, paddingLeft: 0 }}
        >
          <div className="flex justify-between items-center ">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <div className="flex gap-2">
              <DebugButton />
              <Button
                onClick={() =>
                  axios
                    .post('/user/login', {
                      username: 'Karl_Jones',
                      password: '44lwA5KFn15pNCk',
                    })
                    .then((res) => {
                      message.success('Login success');
                      setCurrentUser(res.data.data);
                      return null;
                    })
                }
              >
                Get auth token
              </Button>
              <Button
                onClick={() =>
                  axios
                    .get('/chat?page=1')
                    .then((res) => {
                      message.success('get chat success');
                      console.log('dsad', res.data);
                    })
                    .catch((err) => message.error(err.message))
                }
              >
                Get chatlist
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              {/* <Text>Vu Dang Khuong Duy</Text> */}
              <Text>{user?.name}</Text>

              <Avatar
                src={user?.avatar}
                style={{ backgroundColor: '#87d068' }}
                icon={<UserOutlined />}
              />
            </div>
          </div>
        </Header>
        <Content
          style={{
            minHeight: 280,
            height: ' 100%',
            background: 'transparent     ',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chats;
