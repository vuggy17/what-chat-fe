import React, { useState } from 'react';

import {
  Avatar,
  MenuProps,
  MenuTheme,
  Menu,
  Switch,
  Drawer as AntDrawer,
  Space,
  Typography,
  Collapse,
  Button,
  Divider,
} from 'antd';
import Icon, {
  ApiOutlined,
  ContactsOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentUser } from 'renderer/hooks/use-user';
import SocketClient from 'renderer/services/socket';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { LOGIN } from 'renderer/shared/constants';
import useUI from 'renderer/hooks/use-ui';
import { LocalDb } from 'renderer/services/localdb';
import { ReactComponent as IconSetting } from '../../../../../../assets/icons/setting.svg';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  style?: { verticalAlign: 'middle' }
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    style,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <Typography.Text strong>New group</Typography.Text>,
    'menu_group',
    <Avatar
      icon={<UsergroupAddOutlined style={{ margin: 'auto' }} />}
      shape="square"
      style={{
        backgroundColor: '#fa8c16',
        verticalAlign: 'middle',
        color: 'white',
      }}
    />
  ),
  // getItem(
  //   <Typography.Text strong>New chat</Typography.Text>,
  //   'menu_new_chat',
  //   <Avatar
  //     icon={<UserOutlined style={{ margin: 'auto' }} />}
  //     shape="square"
  //     style={{
  //       backgroundColor: '#2f54eb',
  //       verticalAlign: 'middle',
  //       color: 'white',
  //     }}
  //   />
  // ),
  getItem(
    <Typography.Text strong>Contacts</Typography.Text>,
    'menu_contacts',
    <Avatar
      icon={<ContactsOutlined style={{ margin: 'auto' }} />}
      shape="square"
      style={{
        backgroundColor: '#eb2f96',
        verticalAlign: 'middle',
        color: 'white',
      }}
    />
  ),
  getItem(
    <Typography.Text strong>Setting</Typography.Text>,
    'menu_setting',
    <Avatar
      icon={
        <Icon
          component={IconSetting}
          style={{ fontSize: 20, margin: 'auto' }}
          // color="white"
        />
      }
      shape="square"
      style={{
        backgroundColor: '#a0d911',
        verticalAlign: 'middle',
        color: 'transparent',
      }}
    />
  ),
  getItem(
    <Typography.Text strong>Sign out</Typography.Text>,
    'menu_sign_out',
    <Avatar
      icon={<ApiOutlined style={{ margin: 'auto', color: 'white' }} />}
      shape="square"
      style={{
        backgroundColor: '#f5222d',
        verticalAlign: 'middle',
        color: 'transparent',
      }}
    />
  ),
];

const Title = () => {
  const user = useRecoilValue(currentUser);

  return (
    <div>
      <Space align="center">
        <Avatar
          size="large"
          src={user?.avatar}
          style={{ background: '#389e0d' }}
        />
        <Typography.Title level={5} className="no-margin">
          {user?.name}
        </Typography.Title>
      </Space>
      <div className="mt-7">
        <Typography.Text type="secondary" className="block " editable>
          Coding
        </Typography.Text>
      </div>
    </div>
  );
};

export default function Drawer({
  open,
  toggleVisibility,
}: {
  open: boolean;
  toggleVisibility: () => void;
}) {
  const setUser = useSetRecoilState(currentUser);
  const navigate = useNavigate();
  const { setContactOpen, setNewGroupOpen } = useUI();

  return (
    <AntDrawer
      bodyStyle={{ padding: 0 }}
      title={<Title />}
      placement="left"
      closable={false}
      onClose={toggleVisibility}
      open={open}
      width={272}
    >
      <Menu
        items={items}
        onClick={({ key }) => {
          if (key === 'menu_sign_out') {
            setUser(null);
            navigate(`/${LOGIN}`);
          }
          if (key === 'menu_contacts') {
            toggleVisibility();
            setContactOpen(true);
          }

          if (key === 'menu_group') {
            toggleVisibility();
            setNewGroupOpen(true);
          }
        }}
        selectable={false}
      />
    </AntDrawer>
  );
}
