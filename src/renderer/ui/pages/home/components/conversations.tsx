import { SearchOutlined } from '@ant-design/icons';
import { Divider, Input, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRecoilValue } from 'recoil';
import { chatRepository } from 'renderer/repository/chat.repository';
import { loadChat } from 'renderer/usecase/conversation.usecase';
import { chatItemsSortedState, useChatList } from '../../../../hooks/use-chat';
import ConversationList from './conversation-list';

export default function Conversations() {
  const { listIds, extra: listExtra, setList } = useChatList();
  const conversationItems = useRecoilValue(chatItemsSortedState);

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
          size="large"
          style={{ padding: '8px 11px', color: '#171717' }}
          placeholder="Search a chat"
          prefix={<SearchOutlined className="text-gray-1" />}
        />
      </div>
      <div
        id="scrollableDiv"
        className="flex-1"
        style={{
          overflowY: 'auto',
        }}
      >
        <InfiniteScroll
          style={{ minWidth: 0 }}
          dataLength={listIds.length}
          next={loadMoreData}
          hasMore={listExtra.totalPage !== listExtra.pageNum}
          loader={
            <Skeleton
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
