// import React, { ReactNode, useEffect, useState } from 'react';
// import ConversationController from 'renderer/controllers/chat.controller';
// import messageController from 'renderer/controllers/message.controller';
// import conversationManager from 'renderer/data/chat.manager';

// export default function Preload({
//   children,
//   userId,
// }: {
//   children: ReactNode;
//   userId: Id;
// }) {
//   const [appReady, setAppReady] = useState(false);
//   useEffect(() => {
//     const f = async () => {
//       // TODO: load user data
//       // load converstation list
//       await ConversationController.init();
//       const firstChatid = conversationManager.activeConversationId;
//       return messageController.init(firstChatid);
//     };
//     f()
//       .then((_) => {
//         // TODO: save data to cache
//         console.log('🐱‍🐉 Applicaiton is ready');
//         console.log(conversationManager.activeConversationId);

//         setAppReady(true);
//         return null;
//       })
//       .catch((e) => console.error(e));

//     return () => {
//       // clean cached data
//     };
//   }, []);

//   return <>{appReady ? children : 'Loading'}</>;
// }
