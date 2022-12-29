/* eslint-disable react/button-has-type */
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Layout, Typography } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { currentUser } from 'renderer/hooks/use-user';
import Preload from '../preload/preload_old';

import Group from './components/group';
import Contacts from './pages/contact';

const { Header, Content } = Layout;
const { Text } = Typography;

// use this for debugging purpose only
// TODO: remove this

const AppContainer: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(true);
  const [user, setUser] = useRecoilState(currentUser);

  return (
    <Layout style={{ height: '100vh', overflow: 'auto' }}>
      <Layout className="site-layout h-full">
        <Header
          style={{
            background: 'white',
            height: 'auto',
            padding: 8,
            paddingRight: 0,
          }}
        >
          <div className="flex justify-center items-center h-full">
            <div className="flex gap-2 items-center bg-slate-400 rounded-full pr-2 ">
              <Avatar src={user?.avatar} icon={<UserOutlined />} />
              <Text>{user?.name}</Text>
            </div>
          </div>
        </Header>
        <Divider style={{ margin: 0 }} />
        <Content
          style={{
            minHeight: 280,
            height: '100%',
            background: 'transparent',
          }}
        >
          <Outlet context={{ setContactOpen, setNewGroupOpen: setGroupOpen }} />
        </Content>
      </Layout>
      <Contacts
        key={Math.random()} // mount a new component each time
        open={contactOpen}
        toggleOpen={() => setContactOpen((status) => !status)}
      />
      <Group
        open={groupOpen}
        toggleOpen={() => setGroupOpen((opened) => !opened)}
      />
    </Layout>
  );
};

const AppContainerWithPreload: React.FC = () => {
  return (
    <Preload>
      <AppContainer />
    </Preload>
  );
};

export default AppContainerWithPreload;
