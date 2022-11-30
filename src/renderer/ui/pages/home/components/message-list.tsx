/* eslint-disable react/prop-types */
import { DownOutlined } from '@ant-design/icons';
import { Affix, Button, Spin, Tooltip } from 'antd';
import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { Virtuoso, Components } from 'react-virtuoso';
import { useRecoilValue } from 'recoil';
import { Chat, Message } from 'renderer/domain';
import { currentChatQuery, useChatMessage } from 'renderer/hooks/new-store';

import { currentUser as userState } from 'renderer/hooks/use-user';
import { getMessageOfChat } from 'renderer/usecase/message.usecase';

import MessageBubble from './chat-bubble';

type MessageListProps = {
  messages: WithRequired<Message, 'sender'>[];
  totalCount: number;
  currentUserId: Id;
  onStartReached: () => Promise<void>;
};

const CustomList: Components['List'] = forwardRef(
  ({ style, children }, ref) => {
    return (
      <div style={{ ...style }} className="space-y-1" ref={ref}>
        {children}
      </div>
    );
  }
);

function MessagesList({
  messages,
  totalCount,
  currentUserId,
  onStartReached,
}: MessageListProps) {
  // totalCount starting value is the max value, makes figuring out the index in the messages array easier
  const [firstItemIndex, setFirstItemIndex] = useState(
    totalCount - messages.length
  );
  const [isAtBottom, setIsAtBottom] = useState(true);
  const virtuosoRef = useRef<any>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreItem = useCallback(async () => {
    if (totalCount > messages.length + 1) {
      setIsLoadingMore(true);
      await onStartReached();
      setIsLoadingMore(false);
    }
  }, [totalCount, messages, onStartReached]);

  const toggleFloatingButton = (atBottom: boolean) => {
    setIsAtBottom(atBottom);
  };

  const internalMessages = useMemo(() => {
    const nextFirstItemIndex = totalCount - messages.length;
    setFirstItemIndex(nextFirstItemIndex);
    return messages;
  }, [messages, totalCount]);

  const itemContent = useCallback(
    (index: number, rowData: Message) => {
      const { sender, text, createdAt, id } = rowData;
      const currentIndex = internalMessages.length - (totalCount - index); // map the index to the messages array index

      // check if next message have the same sender
      const nextMessage = internalMessages[currentIndex + 1];
      let isSameSender = nextMessage?.sender.id === sender.id;

      // if next element is a self message, so there is the last message
      // render avatar
      if (nextMessage && nextMessage.sender.id === currentUserId) {
        isSameSender = false;
      }

      return (
        <div className="overflow-hidden" key={id}>
          <MessageBubble
            key={id}
            self={sender.id === currentUserId}
            time={createdAt}
            hasAvatar={!isSameSender} // if next message is from the same sender, don't render avatar
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rowData}
          />
        </div>
      );
    },
    [internalMessages, totalCount, currentUserId]
  );

  const followOutput = useCallback((bottomState: boolean) => {
    return bottomState ? 'smooth' : false;
  }, []);

  // TODO: change scroll behavior to be instance when user is far away from bottom https://virtuoso.dev/scroll-seek-placeholders/
  return (
    <>
      <Virtuoso
        ref={virtuosoRef}
        overscan={{ reverse: 100, main: 200 }}
        data={internalMessages}
        itemContent={itemContent}
        computeItemKey={(_, rowdata) => rowdata.id}
        initialTopMostItemIndex={internalMessages.length - 1}
        firstItemIndex={Math.max(0, firstItemIndex)}
        startReached={loadMoreItem}
        followOutput={followOutput}
        atBottomStateChange={toggleFloatingButton}
        style={{ position: 'relative', height: '100%' }}
        components={{
          Header: () => (
            <>
              {isLoadingMore && (
                <div className="flex justify-center pb-6 pt-2">
                  <Spin spinning />
                </div>
              )}
            </>
          ),
          // List: CustomList,
        }}
      />
      {/* jump to bottom button */}
      <Affix
        offsetBottom={10}
        onChange={(affixed) => console.log(affixed)}
        className="flex justify-center"
      >
        <Tooltip title="Scroll to bottom">
          <Button
            onClick={() =>
              virtuosoRef.current.scrollToIndex({
                index: internalMessages.length - 1,
              })
            }
            icon={<DownOutlined />}
            shape="circle"
            style={{
              opacity: isAtBottom ? 0 : 1,
              transform: isAtBottom ? 'translateY(20px)' : 'translateY(-50px)',
            }}
            className="transition duration-150"
          />
        </Tooltip>
      </Affix>
    </>
  );
}

export default function StateFullMessageList({ chat }: { chat: Chat }) {
  const { prependMessage } = useChatMessage();
  const { messages, total } = useRecoilValue(currentChatQuery);
  const currentUser = useRecoilValue(userState);

  const loadMoreMessages = useCallback(async () => {
    if (total > messages.length + 1) {
      const { data } = await getMessageOfChat(chat.id, messages.length + 1);

      prependMessage(chat.id, data);
    }
  }, [chat, prependMessage, total, messages]);

  return (
    <MessagesList
      messages={messages}
      currentUserId={currentUser?.id || 'this_cant_be_null'}
      totalCount={total}
      onStartReached={loadMoreMessages}
    />
  );
}
