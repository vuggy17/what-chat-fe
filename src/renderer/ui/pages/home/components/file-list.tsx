import { CloudDownloadOutlined, FileOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import { Button, Divider, List, Skeleton, Typography } from 'antd';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatFullTime } from 'renderer/utils/time';

const mockFile = (count: number, from = 0) => {
  return Array.from({ length: count }).map((_, i) => ({
    path: `https://source.unsplash.com/random?sig=${i}`,
    name: `Image ${i + 1}`,
    size: from + i,
    created: faker.date.past(),
  }));
};

const externalFiles = mockFile(100);
export default function FileList({ id }: { id: Id }) {
  const [data, setData] = useState(externalFiles);

  const loadMoreData = () => {
    const newitems = mockFile(10, data.length - 1);
    console.log('load more');
    setData([...data, ...newitems]);
  };

  return (
    <div
      id="fileList"
      className="flex-1 scroll  "
      style={{
        overflowY: 'auto',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore
        loader={<Skeleton active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="fileList"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.size} className="px-3 ">
              <List.Item.Meta
                className="items-center"
                avatar={<FileOutlined style={{ fontSize: '1.2rem' }} />}
                title={<Typography.Text ellipsis>{item.name}</Typography.Text>}
                description={
                  <Typography.Text
                    ellipsis
                    type="secondary"
                    className="text-xs"
                  >
                    {item.size * 1000} bytes
                  </Typography.Text>
                }
              />
              <span>
                <Button icon={<CloudDownloadOutlined />} />
              </span>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
}
