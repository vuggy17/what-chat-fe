import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  RecoilRoot,
  RecoilValue,
  useRecoilRefresher_UNSTABLE,
  useRecoilSnapshot,
} from 'recoil';
import App from './App';
import './config/axios.config';
import ErrorBoundary from './ui/pages/components/ErrorBoundary/ErrorBoundary';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#128C7E',
          colorPrimaryBg: '#ecf7f4',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </ErrorBoundary>
);

// calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
//   // eslint-disable-next-line no-console
//   console.log(arg);
// });
window.electron.ipcRenderer.once('error', (arg) => {
  // eslint-disable-next-line no-console
  console.error('Main process thrown an error', arg);
});

// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
