import { createRoot } from 'react-dom/client';
import App from './App';
import './config/axios.config';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

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
