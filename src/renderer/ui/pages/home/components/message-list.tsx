import { DownOutlined } from '@ant-design/icons';
import { Affix, Button, Skeleton, Tooltip } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Message } from 'renderer/entity';
import MessageBubble from './chat-bubble';

type MessageListProps = {
  messages: Message[];
  chatId: Id;
  virtuoso: any;
  onScrollOnTop: () => void;
};

const START_INDEX = 5000;

export default function MessagesList({
  chatId,
  messages,
  onScrollOnTop,
  virtuoso,
}: MessageListProps) {
  // START_INDEX starting value is the max value, makes figuring out the index in the messages array easier
  const [firstItemIndex, setFirstItemIndex] = useState(
    START_INDEX - messages.length
  );
  const [isAtBottom, setIsAtBottom] = useState(true);

  const toggleFloatingButton = (atBottom: boolean) => {
    setIsAtBottom(atBottom);
  };

  // console.log('MessagesList: Starting firstItemIndex', firstItemIndex);
  // console.log('MessagesList: Starting messages length', messages.length);

  const internalMessages = useMemo(() => {
    const nextFirstItemIndex = START_INDEX - messages.length;
    setFirstItemIndex(nextFirstItemIndex);
    return messages;
  }, [messages]);

  const itemContent = useCallback(
    (index: number, rowData: Message) => {
      const currentIndex = internalMessages.length - (START_INDEX - index); // map the index to the messages array index

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
        startReached={onScrollOnTop}
        followOutput={followOutput}
        atBottomStateChange={toggleFloatingButton}
        style={{ overflow: 'auto' }}
        components={{
          Header: () => (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  active
                  avatar
                  paragraph={{ rows: Math.floor(Math.random() * 2) }}
                />
              ))}
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
              // height: isAtBottom ? 0 : 'auto',
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
