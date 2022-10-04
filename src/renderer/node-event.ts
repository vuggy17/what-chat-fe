// this file handle all nodejs event fire from renderer process

import { message } from 'antd';

window.electron.ipcRenderer.on('saved-file', (filename) => {
  // eslint-disable-next-line no-console
  console.log(filename);
  message.destroy(`download_${filename}`);
  message.success({
    key: `download_${filename}`,
    content: 'Downloaded successfully',
  });
});
