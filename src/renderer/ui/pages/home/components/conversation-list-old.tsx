// /* eslint-disable react/jsx-props-no-spreading */
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Avatar,
//   Badge,
//   Col,
//   Descriptions,
//   Divider,
//   Grid,
//   Layout,
//   List,
//   Row,
//   Skeleton,
//   Space,
//   Typography,
// } from 'antd';
// import { Chat } from 'renderer/domain';
// import formatDTime from 'renderer/utils/time';
// import { BellFilled } from '@ant-design/icons';
// import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
// import { chatByIdState, selectedChatState } from 'renderer/data/chat.managers';
// import { BellOff } from './icons';

// const { Paragraph, Title, Text } = Typography;
// const { useBreakpoint } = Grid;

// type SelectListProps = {
//   data: Chat[];
//   selectedKey: Id;
//   onSelect: (key: any) => void;
// };

// type ConversationItemProps = {
//   id: any;
//   avatar: string | undefined;
//   name: string;
//   description: string;
//   time: Date;
//   status: 0 | 1;
//   typing: boolean;
//   muted: boolean;
//   onSelectItem: (key: any) => void;
// };

// export function ConversationItem({
//   id,
//   avatar,
//   name,
//   description,
//   time,
//   status,
//   onSelectItem,
//   muted = false,
//   typing,
// }: ConversationItemProps) {
//   const itemRef = useRef<HTMLLIElement>(null);
//   const selected = useRecoilValue(selectedChatState);

//   const breakpoints = useBreakpoint();

//   useEffect(() => {
//     if (selected && itemRef.current) {
//       itemRef.current.classList.add('selected-conv-item');
//     }

//     if (!selected && itemRef.current) {
//       itemRef.current.classList.remove('selected-conv-item');
//     }
//   });

//   return (
//     // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
//     <li
//       ref={itemRef}
//       className=" relative py-2 pl-7 pr-2 before:opacity-0 cursor-pointer   "
//       onClick={() => onSelectItem(id)}
//     >
//       {breakpoints.lg ? (
//         <Space
//           direction="horizontal"
//           size="middle"
//           style={{ width: '100%' }}
//           // className="last:flex-1 last:min-w-0"
//         >
//           {status === 1 ? (
//             <Badge color="green">
//               <Avatar
//                 src={avatar}
//                 shape="circle"
//                 size="large"
//                 style={{ height: 50, width: 50, borderRadius: 8 }}
//               />
//             </Badge>
//           ) : (
//             <Avatar src={avatar} shape="circle" size="large" />
//           )}

//           <Row
//             gutter={[16, 8]}
//             style={{ minWidth: 0, flex: 1, marginRight: 0 }}
//             align="middle"
//           >
//             <Col flex="1" style={{ minWidth: 0 }}>
//               <Space
//                 direction="vertical"
//                 style={{
//                   width: '100%',
//                   columnGap: 0,
//                   justifyContent: 'center',
//                   minWidth: 0,
//                 }}
//               >
//                 <Title level={5} ellipsis style={{ margin: 0, minWidth: 0 }}>
//                   {name}
//                 </Title>
//                 {typing ? (
//                   <Text
//                     ellipsis
//                     className="text-primary"
//                     style={{ minWidth: 0 }}
//                   >
//                     Typing...
//                   </Text>
//                 ) : (
//                   <Text ellipsis style={{ minWidth: 0 }}>
//                     {description}
//                   </Text>
//                 )}
//               </Space>
//             </Col>
//             <Col flex="none">
//               <Space direction="vertical" align="end">
//                 <Text type="secondary" className="text-[12px]">
//                   {formatDTime(time.toString())}
//                 </Text>
//                 <Space align="baseline">
//                   {muted && (
//                     <BellOff
//                       color="rgba(92, 107, 119, .6)"
//                       classname="align-middle scale-[.9]  "
//                     />
//                   )}
//                   <Badge
//                     count={10}
//                     overflowCount={9}
//                     style={{
//                       backgroundColor: '#DFF6F4',
//                       color: '#128C7E',
//                       border: '0px',
//                       boxShadow: 'none',
//                       fontWeight: 700,
//                       fontSize: 10,
//                     }}
//                   />
//                 </Space>
//               </Space>
//             </Col>
//           </Row>
//         </Space>
//       ) : (
//         <>
//           {status === 1 ? (
//             <Badge color="green">
//               <Avatar
//                 src={avatar}
//                 shape="circle"
//                 size="large"
//                 style={{ height: 50, width: 50, borderRadius: 8 }}
//               />
//             </Badge>
//           ) : (
//             <Avatar src={avatar} shape="circle" size="large" />
//           )}
//         </>
//       )}
//     </li>
//   );
// }

// export function ConversationItemWithState({
//   id,
//   onSelectItem,
// }: {
//   id: string;
//   onSelectItem: (key: any) => void;
// }) {
//   const setSelectedChat = useSetRecoilState(selectedChatState);
//   const data = useRecoilValue(chatByIdState(id));

//   if (!data) return null;

//   return (
//     <ConversationItem
//       {...data}
//       onSelectItem={() => {
//         setSelectedChat(id);
//       }}
//     />
//   );
// }
// export default function ConversationList({ ...props }: SelectListProps) {
//   return (
//     <ul className="list-none p-0 overflow-hidden">
//       {props.data.map((d, index) => {
//         return (
//           <ConversationItemWithState
//             // typing={d.typing}
//             // avatar={d.avatar || 'https://source.unsplash.com/random/100×100'} // random image if avatar is not set
//             // key={d.id}
//             // id={d.id}
//             // description={d.preview}
//             // status={d.online}
//             // name={d.name + index}
//             // time={d.lastUpdate}
//             // muted={d.muted}
//             id={d.id}
//             onSelectItem={(key) => {
//               // props.onSelect(key);
//             }}
//             // selected={props.selectedKey === d.id}
//           />
//         );
//       })}
//     </ul>
//   );
// }
