import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot, useRecoilSnapshot } from 'recoil';
import App from './App';
import './config/axios.config';
import ErrorBoundary from './ui/pages/components/ErrorBoundary/ErrorBoundary';

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
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <RecoilRoot>
      <DebugObserver />
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
