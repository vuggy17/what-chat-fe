/* eslint-disable react/button-has-type */
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Layout, Typography } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { currentUser } from 'renderer/hooks/use-user';
import Preload from '../preload/preload-old';
import Contacts from './pages/contact';

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

const AppContainer: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
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
          <Outlet context={{ setContactOpen }} />
        </Content>
      </Layout>
      <Contacts
        key={Math.random()} // mount a new component each time
        open={contactOpen}
        toggleOpen={() => setContactOpen((status) => !status)}
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
