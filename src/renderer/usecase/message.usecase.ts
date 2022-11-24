import HttpClient from 'renderer/services/http';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import {
  Message,
  TextMessage,
  FileMessage,
  MessageWithTotalCount,
  PreviewMessage,
} from 'renderer/domain/message.entity';
import {
  IMessageRepository,
  messageRepository,
} from 'renderer/repository/message.respository';
import genId from 'renderer/utils/genid';
import getBase64 from 'renderer/utils/readimg';
import { ISocketClient } from 'renderer/services/type';
import User from 'renderer/domain/user.entity';
import { blob } from 'stream/consumers';
import SocketClient from 'renderer/services/socket';
import SendMessageSocket from './pipeline/socket.handler';
import SendMessageHttp from './pipeline/http.handler';

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
export function createMsgPlaceholder(sender: User, receiver: User | any) {
  if (!sender) throw new Error('User not logged in');

  const uuid = genId(); // temp id used for UI mutation/updates
  return {
    image: (attachments: File, text?: string): FileMessage => {
      const file = attachments;
      const fileInfo = {
        path: URL.createObjectURL(file!),
        name: file!.name,
        size: file!.size,
      };

      return {
        id: uuid,
        attachments,
        type: 'photo',
        uploaded: false,
        createdAt: Date.now(),
        sender,
        receiver,
        status: 'sending',
        chatId: receiver.id,
        text: text || '',
        ...fileInfo,
      };
    },
    file: (attachments: File, text?: string): FileMessage => {
      const file = attachments;
      const fileInfo = {
        path: URL.createObjectURL(file!),
        name: file!.name,
        size: file!.size,
      };
      return {
        id: uuid,
        uploaded: false,
        chatId: receiver.id,
        attachments,
        type: 'file',
        receiver,
        text: text || '',
        sender,
        createdAt: Date.now(),
        status: 'sending',
        ...fileInfo,
      };
    },
    text: (text: string): TextMessage => ({
      id: uuid,
      text,
      type: 'text',
      createdAt: Date.now(),
      sender,
      receiver,
      status: 'sending',
      chatId: receiver.id,
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
  socket: ISocketClient,
  http = HttpClient
) {
  // if (message.type !== 'text') {
  //   console.error('Cannot send message of type', message.type);
  // }
  // const msg = message as TextMessage;
  // return socket.sendPrivateMessage(msg);
  console.log('BEGIN PIPELINE', message);
  switch (message.type) {
    case 'text': {
      const handler = new SendMessageSocket();
      return handler.handle(message);
    }
    case 'photo': {
      const socketHandler = new SendMessageSocket();
      const httpHandler = new SendMessageHttp();
      httpHandler.setNext(socketHandler);
      return httpHandler.handle(
        message as WithRequired<FileMessage, 'attachments'>
      );
    }

    default:
      // eslint-disable-next-line prefer-promise-reject-errors
      return new Promise((resolve, reject) => reject('Message type not found'));
  }
}

export function convertToPreview(message: Message): PreviewMessage {
  let previewText = `${message.text}`; // TODO: get preview text from message
  if (message.type === 'photo') {
    previewText = `${(message.receiver as User).name} send a photo`;
  }
  const preview: PreviewMessage = {
    ...message,
    receiverName: (message.receiver as User).name,
    senderName: (message.sender as User).name,
    text: previewText,
  };

  return preview;
}

/**
 *
 * @param address sender Id
 * @param meta
 * @param sendService
 */
export function sendMessageReceivedAck(
  address: Id,
  meta: {
    chatId: Id;
    receiverId: Id;
    messageId: Id;
  },
  sendService: ISocketClient = SocketClient
) {
  return sendService.sendReceivedMessageAck(address, meta);
}

/**
 *
 * @param chatId
 * @param messageId
 * @param userId who is reading the message
 * @param toId to whom the message is sent
 * @param time unix timestamp
 * @param sendService
 */
export function seenMessage(
  chatId: Id,
  messageId: Id,
  userId: Id,
  toId: Id,
  time: number,
  sendService: ISocketClient = SocketClient
) {
  return sendService.seenMessage(chatId, messageId, userId, toId, time);
}
