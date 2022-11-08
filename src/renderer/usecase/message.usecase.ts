import { IUser } from 'renderer/domain/user.entity';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import {
  Message,
  TextMessage,
  FileMessage,
  MessageWithTotalCount,
} from 'renderer/domain/message.entity';
import {
  IMessageRepository,
  messageRepository,
} from 'renderer/repository/message.respository';
import genId from 'renderer/utils/genid';
import getBase64 from 'renderer/utils/readimg';
import { ISocketClient } from 'renderer/services/type';

// export function createMessage(content: string | any, id?: any): Message {
//   return {
//     id: id || genId(),
//     content,
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
export function createMsgPlaceholder(
  sender: IUser,
  receiver: IUser | any,
  content: string | any
) {
  if (!sender) throw new Error('User not logged in');

  const uuid = genId(); // temp id used for UI mutation/updates
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
        attachments: content,
        type: 'photo',
        uploaded: false,
        createdAt: Date.now(),
        sender,
        receiver,
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
        type: 'file',
        senderId,
        createdAt: Date.now(),
        status: 'unsent',
        ...fileInfo,
      };
    },
    text: (): TextMessage => ({
      id: uuid,
      text: content,
      type: 'text',
      createdAt: Date.now(),
      sender,
      receiver,
      status: 'unsent',
      chatId: null,
    }),
  };
}

/**
 *  get messages of chat in reverse order
 * @param chatId chat id to get messages from
 * @param offset number messages to skip
 * @param repo repository to get messages from
 * @returns {Promise<{data:Message[], total: number}>}
 */
export async function getMessageOfChat(
  chatId: Id,
  offset: number,
  repo: IMessageRepository = messageRepository
): Promise<MessageWithTotalCount> {
  return repo.getMessages(chatId, offset);
}

export async function sendMessageOnline(
  message: Message,
  sendService: ISocketClient
) {
  if (message.type !== 'text') {
    console.error('Cannot send message of type', message.type);
  }
  const msg = message as TextMessage;
  return sendService.sendPrivateMessage(msg);
}
