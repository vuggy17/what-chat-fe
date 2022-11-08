import { DownOutlined } from '@ant-design/icons';
import { Affix, Button, Spin, Tooltip } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useRecoilValue } from 'recoil';
import { Chat, Message } from 'renderer/domain';
import { useMessage } from 'renderer/hooks/use-chat-message';
import { currentUser as userState } from 'renderer/hooks/use-user';
import { RequiredField } from 'renderer/utils/type';
import MessageBubble from './chat-bubble';

type MessageListProps = {
  messages: RequiredField<Message, 'sender'>[];
  chat: Chat;
  totalCount: number;
};

export default function MessagesList({
  chat,
  messages,
  totalCount,
}: MessageListProps) {
  // totalCount starting value is the max value, makes figuring out the index in the messages array easier
  const [firstItemIndex, setFirstItemIndex] = useState(
    totalCount - messages.length
  );
  const { prependMany } = useMessage();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const virtuosoRef = useRef<any>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentUser = useRecoilValue(userState);

  const loadMoreItem = useCallback(async () => {
    // setIsLoadingMore(true);
    // const res = await getMessageOfChat(chat.id, messages.length);
    // setIsLoadingMore(false);
    // prependMany(chat.id, newMsg);
    // console.log('ds', res);
  }, [chat, prependMany]);

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

      // check if next messaage have the same sender
      const nextMessage = internalMessages[currentIndex + 1];
      let isSameSender = nextMessage?.sender.id === sender.id;

      // if next element is a self message, so there is the last message
      // render avatar
      if (nextMessage && nextMessage.sender.id === currentUser?.id) {
        isSameSender = false;
      }

      return (
        <div className="overflow-hidden" key={id}>
          <MessageBubble
            content={text}
            self={sender.id === currentUser?.id}
            time={createdAt}
            hasAvatar={!isSameSender} // if next message is from the same sender, don't render avatar
            key={id}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rowData}
          />
        </div>
      );
    },
    [internalMessages, totalCount, currentUser]
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
        style={{ overflow: 'auto' }}
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
