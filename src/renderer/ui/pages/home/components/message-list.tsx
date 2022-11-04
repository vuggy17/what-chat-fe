import { DownOutlined } from '@ant-design/icons';
import { Affix, Button, Skeleton, Spin, Tooltip } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Message } from 'renderer/domain';
import IUser from 'renderer/domain/user.entity';
import { useMessage } from 'renderer/hooks/use-chat-message';
import { mockUsers } from 'renderer/mock/user';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
import { getMessageOfChat } from 'renderer/usecase/message.usecase';
import { RequiredField } from 'renderer/utils/type';
import MessageBubble from './chat-bubble';

type MessageListProps = {
  messages: RequiredField<Message, 'chatId' | 'senderId'>[];
  chatId: Id;
  virtuoso: any;
  totalCount: number;
};

export default function MessagesList({
  chatId,
  messages,
  virtuoso,
  totalCount,
}: MessageListProps) {
  // totalCount starting value is the max value, makes figuring out the index in the messages array easier
  const [firstItemIndex, setFirstItemIndex] = useState(
    totalCount - messages.length
  );
  const { prependMany } = useMessage();
  const [isAtBottom, setIsAtBottom] = useState(true);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreItem = useCallback(async () => {
    setIsLoadingMore(true);
    const newMsg = await getMessageOfChat(chatId, messages.length);
    setIsLoadingMore(false);
    prependMany(chatId, newMsg);
  }, [chatId]);

  const toggleFloatingButton = (atBottom: boolean) => {
    setIsAtBottom(atBottom);
  };

  // cache user by message senderId
  const userChatMap: Record<Id, IUser> = useMemo(() => {
    const record = {} as Record<Id, IUser>;
    messages.forEach((message) => {
      if (!record[message.senderId]) {
        record[message.senderId] = mockUsers.find(
          (u) => u.id === message.senderId
        )!;
      }
    });
    return record;
  }, [messages]);

  const internalMessages = useMemo(() => {
    const nextFirstItemIndex = totalCount - messages.length;
    setFirstItemIndex(nextFirstItemIndex);
    return messages;
  }, [messages]);

  const itemContent = useCallback(
    (index: number, rowData: Message) => {
      const currentIndex = internalMessages.length - (totalCount - index); // map the index to the messages array index

      // check if next messaage have the same sender
      const nextMessage = internalMessages[currentIndex + 1];
      let isSameSender = nextMessage?.senderId === rowData.senderId;

      // if next element is a self message, so there is the last message
      // render avatar
      if (nextMessage && nextMessage.fromMe) {
        isSameSender = false;
      }

      return (
        <div className="overflow-hidden" key={rowData.id}>
          <MessageBubble
            content={rowData.content}
            self={rowData.fromMe}
            time={rowData.createdAt}
            hasAvatar={!isSameSender} // if next message is from the same sender, don't render avatar
            key={rowData.id}
            sender={userChatMap[rowData.senderId]}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rowData}
          />
        </div>
      );
    },
    [internalMessages]
  );

  const followOutput = useCallback((bottomState: boolean) => {
    return bottomState ? 'smooth' : false;
  }, []);

  // TODO: change scroll behavior to be instance when user is far away from bottom https://virtuoso.dev/scroll-seek-placeholders/
  return (
    <>
      <Virtuoso
        ref={virtuoso}
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
              virtuoso.current.scrollToIndex({
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
