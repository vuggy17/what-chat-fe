import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import {
  Message,
  TextMessage,
  FileMessage,
} from 'renderer/domain/message.entity';
import {
  IMessageRepository,
  messageRepository,
} from 'renderer/repository/message.respository';
import genId from 'renderer/utils/genid';
import getBase64 from 'renderer/utils/readimg';

// export function createMessage(content: string | any, id?: any): Message {
//   return {
//     id: id || genId(),
//     globalId: null,
//     content,
//     fromMe: true,
//     type: 'text',
//     createdAt: new Date(),
//     status: 'unsent',
//     senderId: '0',
//   };
// }

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

/**
 *  get messages of chat in reverse order
 * @param chatId chat id to get messages from
 * @param skip number messages to skip
 * @param count total amount of messages to get
 * @param repo repository to get messages from
 * @returns {Promise<Message[]>}
 */
export async function getMessageOfChat(
  chatId: Id,
  skip: number,
  count = MSG_PAGE_SIZE,
  repo: IMessageRepository = messageRepository
) {
  const message = await repo.getMessages(chatId, count, skip);
  return message;
}
