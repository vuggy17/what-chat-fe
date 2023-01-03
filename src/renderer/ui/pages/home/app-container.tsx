/* eslint-disable react/button-has-type */
import { ConsoleSqlOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Layout, Typography } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { currentUser } from 'renderer/hooks/use-user';
import Preload from '../preload/preload_old';

import Group from './components/group';
import Contacts from './pages/contact';
import Social from './components/social';

const { Header, Content } = Layout;
const { Text } = Typography;

// use this for debugging purpose only
// TODO: remove this

const AppContainer: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
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
          <Outlet
            context={{
              setContactOpen,
              setNewGroupOpen: setGroupOpen,
              setSocialOpen,
            }}
          />
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
      <Social
        open={socialOpen}
        toggleOpen={() => setSocialOpen((opened) => !opened)}
      />
    </Layout>
  );
};

const AppContainerWithPreload: React.FC<{
  reset: () => void;
}> = ({ reset }) => {
  console.log('i got reseted');
  return (
    <Preload reset={reset}>
      <AppContainer />
    </Preload>
  );
};

export default AppContainerWithPreload;
