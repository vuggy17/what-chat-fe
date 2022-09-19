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
  Tooltip,
  Typography,
} from 'antd';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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

const Chats: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout style={{ height: '100vh', overflow: 'auto' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="pr-8 pl-4"
        width={220}
      >
        <div className="flex flex-col flex-1 h-full justify-between ">
          <div>
            <div className=" m-[16px] ml-0">
              <img src={logo} alt="logo" className="w-[32px] " />
              {!collapsed && (
                <p className="inset-0 inline font-semibold duration-300 transition-opacity  text-green-700 text-center align-middle ml-3">
                  Tailwind
                </p>
              )}
            </div>
            <Menu
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
              <Text>Vu Dang Khuong Duy</Text>
              <Text>
                <Avatar
                  style={{ backgroundColor: '#87d068' }}
                  icon={<UserOutlined />}
                />
              </Text>
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
