/* eslint-disable react/button-has-type */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import icon from '../../assets/icon.svg';
import './App.css';
import 'antd/dist/antd.less';
import 'tailwindcss/tailwind.css';
import LoginCheckPoint from './shared/protected-route';
import {
  CHAT,
  C_CONVERSATION,
  C_FRIEND,
  C_PROFILE,
  LOGIN,
  REGISTER,
} from './shared/constants';
import Login from './ui/pages/auth/login';
import Register from './ui/pages/auth/register';
import Chats from './ui/pages/home/chats';
import Chat from './ui/pages/home/pages/chat';
import Profile from './ui/pages/home/pages/profile';
import Friends from './ui/pages/home/pages/friends';
import ChatBoxProvider from './shared/context/chatbox.context';
import Preload from './ui/pages/preload/preload';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={REGISTER} element={<Register />} />
        <Route
          path={CHAT}
          element={
            <Preload>
              <Chats />
            </Preload>
          }
        >
          <Route
            path={C_CONVERSATION}
            element={
              <ChatBoxProvider>
                <Chat />
              </ChatBoxProvider>
            }
          />
          <Route path={C_FRIEND} element={<Friends />} />
          <Route path={C_PROFILE} element={<Profile />} />
          <Route
            index
            element={
              <ChatBoxProvider>
                <Chat />
              </ChatBoxProvider>
            }
          />
        </Route>

        {/* <Route path="*" element={<LoginCheckPoint />} /> */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
