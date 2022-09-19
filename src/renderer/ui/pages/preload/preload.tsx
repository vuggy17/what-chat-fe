import React, { ReactNode, useEffect, useState } from 'react';
import ConversationController from 'renderer/controllers/conversation.controller';

export default function Preload({ children }: { children: ReactNode }) {
  const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    const f = async () => {
      await ConversationController.loadConversation(undefined); // first load
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
