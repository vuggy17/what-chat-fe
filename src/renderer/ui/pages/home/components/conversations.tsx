import { SearchOutlined } from '@ant-design/icons';
import { Input, Skeleton } from 'antd';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Chat } from 'renderer/domain';
import {
  chatExtraState,
  currentChatIdState,
  sortedChatsQuery,
} from 'renderer/hooks/new-store';
import { chatRepository } from 'renderer/repository/chat/chat.repository';
import useDebounce from 'renderer/utils/debouce';
import ConversationList, { EmptyChatItem } from './conversation-list';

export default function Conversations() {
  // const { listIds, extra: listExtra, setList } = useChatList();
  const listExtra = useRecoilValue(chatExtraState);
  const conversationItems = useRecoilValue(sortedChatsQuery);
  const setActiveChat = useSetRecoilState(currentChatIdState);
  // const setActiveChat = useSetRecoilState(activeChatIdState);
  // const conversationItems = useRecoilValue(chatItemsSortedState);
  const [chatResult, setChatResult] = useState<
    Pick<Chat, 'name' | 'id' | 'avatar'>[]
  >([]);

  const findChat = async (key: string) => {
    if (!key) {
      setChatResult([]);
      return;
    }
    const data = await chatRepository.findChatByParticipantName(key);
    setChatResult(data.data);
  };
  const debounceSearch = useDebounce(findChat, 500);

  const loadMoreData = async () => {
    // const { data, extra } = await loadChat({
    //   repo: chatRepository,
    //   page: listExtra.pageNum + 1,
    // });
    // setList({ data, extra });
    alert('cc');
  };

  console.log('====================================');
  console.log('conversationItems', conversationItems);
  console.log('====================================');

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col  ">
      <div className="ml-7 mr-6 pt-6 pb-8">
        <Input
          onClick={() => {
            console.log(location.pathname);
            if (location.pathname.includes('new-chat')) {
              navigate('/app/conversations');
            }
          }}
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
            dataLength={conversationItems.length}
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
