// import { SearchOutlined } from '@ant-design/icons';
// import { Divider, Input, Skeleton } from 'antd';
// import { useLayoutEffect, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import ConversationController from 'renderer/controllers/chat.controller';
// import { Chat as ChatEntity } from 'renderer/domain';
// import ConversationList from './conversation-list';

// export default function Conversations() {
//   const [data, setData] = useState<ChatEntity[]>([]);

//   const loadMoreData = () => {
//     ConversationController.loadChat(data.length - 1);
//   };

//   useLayoutEffect(() => {
//     // subscrible for converstaion added or removed
//     const subcription = ConversationController.chats.subscribe({
//       next: (v) => {
//         console.log('conversation changed', v.length - 1);

//         setData(v);
//       },
//     });
//     return () => {
//       subcription.unsubscribe();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="h-full flex flex-col  ">
//       <div className="ml-7 mr-6 pt-5 pb-8">
//         <Input
//           size="large"
//           style={{ padding: '8px 11px', color: '#171717' }}
//           placeholder="Search a chat"
//           prefix={<SearchOutlined className="text-gray-1" />}
//         />
//       </div>
//       <div
//         id="scrollableDiv"
//         className="flex-1"
//         style={{
//           overflowY: 'auto',
//         }}
//       >
//         <InfiniteScroll
//           style={{ minWidth: 0 }}
//           dataLength={data.length}
//           next={loadMoreData}
//           hasMore
//           loader={
//             <Skeleton
//               avatar
//               paragraph={{
//                 rows: 1,
//               }}
//               active
//             />
//           }
//           endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
//           scrollableTarget="scrollableDiv"
//         >
//           <ConversationList
//             data={data}
//             selectedKey={active}
//             onSelect={(key) => onChatIdChange(key)}
//           />
//         </InfiniteScroll>
//       </div>
//     </div>
//   );
// }
