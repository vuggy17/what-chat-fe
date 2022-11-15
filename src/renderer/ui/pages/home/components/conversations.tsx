import { SearchOutlined } from '@ant-design/icons';
import { Divider, Input, Skeleton } from 'antd';
import { stringify } from 'querystring';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Chat } from 'renderer/domain';
import User from 'renderer/domain/user.entity';
import { chatRepository } from 'renderer/repository/chat.repository';
import { loadChat } from 'renderer/usecase/conversation.usecase';
import useDebounce from 'renderer/utils/debouce';
import {
  activeChatIdState,
  chatItemsSortedState,
  useChatList,
} from '../../../../hooks/use-chat';
import ConversationList, { EmptyChatItem } from './conversation-list';

export default function Conversations() {
  const { listIds, extra: listExtra, setList } = useChatList();
  const setActiveChat = useSetRecoilState(activeChatIdState);
  const conversationItems = useRecoilValue(chatItemsSortedState);
  const [chatResult, setChatResult] = useState<
    Pick<Chat, 'name' | 'id' | 'avatar'>[]
  >([]);

  const findChat = async (key: string) => {
    if (!key) {
      setChatResult([]);
      return;
    }
    console.log(key);
    const data = await chatRepository.findChatByParticipantName(key);
    console.log(data.data);
    setChatResult(data.data);
  };
  const debounceSearch = useDebounce(findChat, 500);

  const loadMoreData = async () => {
    const { data, extra } = await loadChat({
      repo: chatRepository,
      page: listExtra.pageNum + 1,
    });
    setList({ data, extra });
  };

  return (
    <div className="h-full flex flex-col  ">
      <div className="ml-7 mr-6 pt-5 pb-8">
        <Input
          onChange={(e) => debounceSearch(e.target.value)}
          size="large"
          style={{ padding: '8px 11px', color: '#171717' }}
          placeholder="Search a chat"
          prefix={<SearchOutlined className="text-gray-1" />}
        />
      </div>
      <>
        <ul
          className="list-none p-0 overflow-hidden"
          style={{
            visibility: chatResult.length !== 0 ? 'visible' : 'hidden',
          }}
        >
          {chatResult.map((item) => (
            <EmptyChatItem
              onPress={(id) => {
                setActiveChat(id);
                setChatResult([]);
              }}
              name={item.name}
              id={item.id}
              key={item.id}
              avatarUrl={item.avatar}
              active={false}
            />
          ))}
        </ul>
        <div
          id="scrollableDiv"
          className="flex-1"
          style={{
            overflowY: 'auto',
            visibility: chatResult.length === 0 ? 'visible' : 'hidden',
          }}
        >
          <InfiniteScroll
            style={{ minWidth: 0 }}
            dataLength={listIds.length}
            next={loadMoreData}
            hasMore={listExtra.totalPage !== listExtra.pageNum}
            loader={
              <Skeleton
                className="pl-7 pr-2"
                avatar
                paragraph={{
                  rows: 1,
                }}
                active
              />
            }
            // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
            <ConversationList data={conversationItems} />
          </InfiniteScroll>
        </div>
      </>
    </div>
  );
}
