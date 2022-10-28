/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import {
  Message,
  TextMessage,
  FileMessage,
} from 'renderer/domain/message.entity';
import genId from 'renderer/utils/genid';
import getBase64 from 'renderer/utils/readimg';

export function createMessage(content: string | any, id?: any): Message {
  return {
    id: id || genId(),
    globalId: null,
    content,
    fromMe: true,
    type: 'text',
    createdAt: new Date(),
    status: 'unsent',
    senderId: '0',
  };
}

/**
 *
 * @param content can be a file or a string
 * @returns new message object to display in the UI
 */
export function createMsgPlaceholder(chatId: Id, content: string | any) {
  const uuid = genId();
  return {
    image: (): FileMessage => {
      const file = content as File;
      const fileInfo = {
        path: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      };
      return {
        id: uuid,
        globalId: null,
        content,
        type: 'photo',
        uploaded: false,
        createdAt: new Date(),
        fromMe: true,
        senderId: '0',
        chatId,
        status: 'unsent',
        ...fileInfo,
      };
    },
    file: (): Message => {
      const file = content as File;
      const fileInfo = {
        path: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      };
      return {
        id: uuid,
        uploaded: false,
        chatId,
        content: file,
        globalId: null,
        type: 'file',
        senderId: '0',
        createdAt: new Date(),
        fromMe: true,
        status: 'unsent',
        ...fileInfo,
      };
    },
    text: (): TextMessage => ({
      id: uuid,
      globalId: null,
      content,
      fromMe: true,
      type: 'text',
      createdAt: new Date(),
      senderId: '0',
      status: 'unsent',
      chatId,
    }),
  };
}
