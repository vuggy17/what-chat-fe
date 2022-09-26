import React, { ReactNode, useEffect, useState } from 'react';
import ConversationController from 'renderer/controllers/conversation.controller';

export default function Preload({
  children,
  userId,
}: {
  children: ReactNode;
  userId: Id;
}) {
  const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    const f = async () => {
      // TODO: load user data
      // load converstation list
      await ConversationController.loadConversation(undefined);
      // TODO: load first conversation messages
    };
    f()
      .then((_) => {
        setAppReady(true);
        return null;
      })
      .catch((e) => console.error(e));

    return () => {
      // clean cached data
    };
  }, []);

  return <>{appReady ? children : 'Loading'}</>;
}
