import { ArrowLeftOutlined, BackwardFilled } from '@ant-design/icons';
import { Button, Col, Divider, List, Row, Skeleton } from 'antd';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { groupBy } from 'renderer/utils/array';

const genMockImage = (count: number, lastIndex: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    src: `https://source.unsplash.com/random?sig=${i}`,
    alt: `Image ${i + 1 + lastIndex}`,
  }));
};

const images = genMockImage(100, 0);

export default function MediaGalery({ id }: { id: Id }) {
  const [data, setData] = useState(groupBy<typeof images[0]>(images, 3));

  const loadMoreData = () => {
    const newitems = groupBy<typeof images[0]>(
      genMockImage(12, data.length - 1),
      3
    );
    setData([...data, ...newitems]);
  };

  return (
    <div
      id="imagelist"
      className="flex-1  "
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
        scrollableTarget="imagelist"
      >
        {data.map((row) => {
          return (
            <Row className="h-[150px]">
              {row.map((image: { src: string; alt: string }) => {
                return (
                  <Col span={8} className="overflow-hidden">
                    <img
                      src={image.src}
                      loading="lazy"
                      className="object-cover w-full h-full"
                      alt={image.alt}
                    />
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </InfiniteScroll>
    </div>
  );
}
