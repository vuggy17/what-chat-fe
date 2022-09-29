import {
  Message,
  PhotoMessage,
  TextMessage,
} from 'renderer/entity/message.entity';
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
    image: (): PhotoMessage => {
      const file = content as File;
      const path = URL.createObjectURL(file);
      return {
        id: uuid,
        globalId: null,
        content,
        type: 'photo',
        path,
        uploaded: false,
        createdAt: new Date(),
        fromMe: true,
        senderId: '0',
        chatId,
        status: 'unsent',
      };
    },
    file: (): Message => {
      const file = content as File;
      const fileInfo = {
        path: URL.createObjectURL(file),
        name: file.name,
      };
      return {
        id: uuid,
        path: fileInfo.path,
        name: fileInfo.name,
        uploaded: false,
        chatId,
        content: file,
        globalId: null,
        type: 'file',
        senderId: '0',
        createdAt: new Date(),
        fromMe: true,
        status: 'unsent',
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

// // return image which have content is a base64 string
// export async function createMessageFromImage(content: File): Promise<Message> {
//   const base64 = await getBase64(content);
//   return {
//     id: genId(),
//     globalId: null,
//     content: base64,
//     type: 'photo',
//     createdAt: new Date(),
//     fromMe: true,
//     status: 'sending',
//   };
// }

// // return image which have content is a File
// export function genImageMessage(img: File, id?: any): Message {
//   return {
//     id: id || genId(),
//     content: img,
//     globalId: null,
//     type: 'photo',
//     createdAt: new Date(),
//     fromMe: true,
//     status: 'sending',
//   };
// }

// // get file preview
// export async function genFilePreview(file: File, id?: any): Promise<Message> {
//   // const base64 = await getBase64(file);
//   const fileInfo = {
//     path: URL.createObjectURL(file),
//     name: file.name,
//   };
//   console.log('filepaht', fileInfo.path);

//   return {
//     id: id || genId(),
//     content: JSON.stringify(fileInfo),
//     globalId: null,
//     type: 'file',
//     createdAt: new Date(),
//     fromMe: true,
//     status: 'sending',
//   };
// }

// export function genFileMessage(file: File, id?: any): Message {
//   return {
//     id: id || genId(),
//     content: file,
//     type: 'file',
//     globalId: null,
//     createdAt: new Date(),
//     fromMe: true,
//     status: 'sending',
//   };
// }

export function appendNewMessages(newMessages: Message[], initials: Message[]) {
  return [...newMessages, ...initials];
}
