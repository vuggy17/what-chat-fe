import { Col, Divider, Row, Skeleton } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRecoilValue } from 'recoil';
import { FileMessage } from 'renderer/domain';
import { currentChatQuery } from 'renderer/hooks/new-store';
import { groupBy } from 'renderer/utils/common';

const genMockImage = (count: number, lastIndex: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    src: `https://source.unsplash.com/random?sig=${i}`,
    alt: `Image ${i + 1 + lastIndex}`,
  }));
};

const images = genMockImage(100, 0);

export default function MediaGalery({ id }: { id: Id }) {
  const messages = useRecoilValue(currentChatQuery)?.messages ?? [];

  const fileMessages = messages.filter(
    (m) => m.type === 'photo'
  ) as FileMessage[];

  const urls = fileMessages.map((m) => m.attachments).flat(2);

  console.log('urls', urls);

  const loadMoreData = () => {
    // const newitems = groupBy<typeof images[0]>(
    //   genMockImage(12, data.length - 1),
    //   3
    // );
    // setData([...data, ...newitems]);
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
        dataLength={urls.length}
        next={loadMoreData}
        hasMore
        loader={<Skeleton active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="imagelist"
      >
        {groupBy<typeof urls[0]>(urls, 3).map((row) => {
          return (
            <Row className="h-[150px]">
              {row.map((url) => {
                return (
                  <Col span={8} className="overflow-hidden">
                    <img
                      src={url}
                      loading="lazy"
                      className="object-cover w-full h-full"
                      alt={url}
                    />
                  </Col>
                );
              })}
            </Row>
          );
        })}
        {/* {data.map((row) => {
          return (

          );
        })} */}
      </InfiniteScroll>
    </div>
  );
}
