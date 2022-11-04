import { MoreOutlined } from '@ant-design/icons';
import { Button, Divider, Skeleton, Space, Typography } from 'antd';

export default function HeaderFallback() {
  return (
    <>
      <div className="pt-4 flex justify-between items-center pl-4 pr-10 ">
        <Space size="middle" align="center">
          <Skeleton.Avatar active style={{ marginTop: 6 }} shape="circle" />
          <Skeleton.Input className="pt-[6px]" active />
        </Space>
        <Button
          icon={<MoreOutlined />}
          type="text"
          className="text-2xl text-gray-1"
          size="large"
          onClick={() => console.log('im just a placeholder')}
        />
      </div>
      <Divider style={{ marginTop: 18, marginBottom: 0 }} />
    </>
  );
}
