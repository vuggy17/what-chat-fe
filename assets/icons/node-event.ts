// this file handle all nodejs event fire from renderer process

import { message } from 'antd';
import { shell } from 'electron';

window.electron.ipcRenderer.on('saved-file', (filename) => {
  // eslint-disable-next-line no-console
  console.log(filename);
  message.destroy(`download_${filename}`);
  message.success({
    key: `download_${filename}`,
    content: 'Downloaded successfully',
  });
});

window.electron.ipcRenderer.on('url-downloaded', (args) => {
  const typedFile = (args as unknown[] as DownloadFileCompletedPayload[])[0];
  message.success({
    content: 'File downloaded successfully, click to view file',
    duration: 2,
    onClick: () => {
      window.electron.ipcRenderer.sendMessage('open-file', typedFile.path);
    },
    style: { cursor: 'pointer' },
  });
});
