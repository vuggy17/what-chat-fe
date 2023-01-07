/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import { Suspense, useEffect, createContext } from 'react';
import {
  RecoilRoot,
  RecoilValue,
  useRecoilRefresher_UNSTABLE,
  useRecoilSnapshot,
} from 'recoil';
import {
  APP,
  C_CONVERSATION,
  C_FRIEND,
  C_PROFILE,
  LOGIN,
  REGISTER,
} from './shared/constants';
import Login from './ui/pages/auth/login';
import Register from './ui/pages/auth/register';
import AppContainer from './ui/pages/home/app-container';
import Chat from './ui/pages/home/pages/chat';
import Profile from './ui/pages/home/pages/profile';
import Friends from './ui/pages/home/pages/friends';
import ChatBoxProvider from './shared/context/chatbox.context';
import './node-event';
import HeaderFallback from './ui/pages/home/components/loaders/header.fallback';
import NewChat from './ui/pages/home/components/new-chat';
import RecentChat from './ui/pages/home/components/recent-chat';
import { useResetApp } from './hooks/new-store';
import { SearchChatProvider } from './hooks/use-ui';

function DebugObserver() {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug('The following atoms were modified:');
    // eslint-disable-next-line no-restricted-syntax
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}

const RecoilCachResetEntry = ({ node }: { node: RecoilValue<unknown> }) => {
  const resetNode = useRecoilRefresher_UNSTABLE(node);
  useEffect(() => {
    return () => resetNode();
  }, [resetNode]);
  return null;
};

const RecoilCacheReset = () => {
  const snapshot = useRecoilSnapshot();
  return (
    <>
      {Array.from(snapshot.getNodes_UNSTABLE()).map((node) => (
        <RecoilCachResetEntry key={node.key} node={node} />
      ))}
    </>
  );
};

// context for reset recoil state by reset it's key
type AppContextType = {
  key: number;
  reset: () => void;
};
const AppContext = createContext({} as AppContextType);

export default function App() {
  const { key, reset } = useResetApp();

  return (
    <RecoilRoot key={key}>
      <DebugObserver />
      <RecoilCacheReset />
      <Router>
        <Routes>
          <Route path={LOGIN} element={<Login />} />
          <Route path={REGISTER} element={<Register />} />

          <Route path={APP} element={<AppContainer reset={reset} />}>
            <Route
              path={`${C_CONVERSATION}/*`}
              element={
                <ChatBoxProvider>
                  <SearchChatProvider>
                    <Chat />
                  </SearchChatProvider>
                </ChatBoxProvider>
              }
            />
            {/* <Route index element={<RecentChat />} />
            <Route path="new-chat" element={<NewChat />} /> */}
            <Route
              path={C_FRIEND}
              element={
                <Suspense fallback={<HeaderFallback />}>
                  <ChatBoxProvider>
                    <Friends />
                  </ChatBoxProvider>
                </Suspense>
              }
            />
            <Route path={C_PROFILE} element={<Profile />} />
            <Route index element={<Navigate to={C_CONVERSATION} />} />
          </Route>

          <Route path="*" element={<Navigate to={LOGIN} />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}
