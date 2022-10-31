import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import './config/axios.config';
import ErrorBoundary from './ui/pages/components/ErrorBoundary/ErrorBoundary';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </ErrorBoundary>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.once('error', (arg) => {
  // eslint-disable-next-line no-console
  console.error('Main process thrown an error', arg);
});

window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
