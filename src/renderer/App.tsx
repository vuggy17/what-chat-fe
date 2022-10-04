/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

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
import './node-event';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>Something went wrong.</h1>;
          {this.state.error && this.state.error.toString()}
          <br />
          {this.state.errorInfo.componentStack}
        </>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary className="scroll">
      <Router>
        <Routes>
          <Route path={LOGIN} element={<Login />} />
          <Route path={REGISTER} element={<Register />} />
          <Route
            path={CHAT}
            element={
              <Preload userId="1">
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
    </ErrorBoundary>
  );
}
