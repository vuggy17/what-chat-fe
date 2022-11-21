import { Button, Divider, Layout, Tooltip, Typography } from 'antd';
import { Suspense } from 'react';

import { FormOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import Conversations from '../components/conversations';

const { Header, Sider, Content } = Layout;

export default function Chat() {
  const navigate = useNavigate();

  return (
    <Layout className="h-full " style={{ background: 'white' }}>
      <Header className="bg-white px-4 ">
        <div className="flex w-full justify-between items-center">
          <Typography.Title level={2}> Messages</Typography.Title>
          <Tooltip title="Compose message" placement="topLeft">
            <Button
              icon={<FormOutlined />}
              type="link"
              onClick={() => navigate('new-chat')}
            />
          </Tooltip>
        </div>
      </Header>
      <Layout className="h-full rounded-xl bg-[#f3f3f3]">
        <Sider
          theme="light"
          style={{ background: 'transparent' }}
          width={360}
          collapsedWidth={110}
          breakpoint="lg"
        >
          <Suspense fallback="loading..">
            <Conversations />
          </Suspense>
        </Sider>

        <Divider type="vertical" className="h-full mr-0" />
        <Outlet />
      </Layout>
    </Layout>
  );
}
