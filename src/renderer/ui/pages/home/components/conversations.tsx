import { Button, Input, Skeleton } from 'antd';
import { Suspense, useState } from 'react';
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

function List() {
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
    // TODO: implement load more
    // const { data, extra } = await loadChat({
    //   repo: chatRepository,
    //   page: listExtra.pageNum + 1,
    // });
    // setList({ data, extra });
    // alert('load more');
  };

  return (
    <div className="h-full">
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
    </div>
  );
}

export default function Conversations() {
  return (
    <Suspense fallback="loading..">
      <List />
    </Suspense>
  );
}
