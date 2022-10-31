/* eslint-disable max-classes-per-file */
import { Chat, Message } from 'renderer/domain';
import { OConveration, OMessage } from 'renderer/services/type';

interface IParser<E, R> {
  fromEntity(v: E): R;
  toEntity(v: R): E;
}

class ChatParser implements IParser<Chat, OConveration> {
  fromEntity(v: Chat): OConveration {
    throw new Error('Method not implemented.');
  }

  toEntity(v: OConveration): Chat {
    throw new Error('Method not implemented.');
  }
}

class MessageParser implements IParser<Message, OMessage> {
  fromEntity(v: Message): OMessage {
    throw new Error('Method not implemented.');
  }

  toEntity(v: OMessage): Message {
    throw new Error('Method not implemented.');
  }
}

const chatParser = new ChatParser();
const messageParser = new MessageParser();

export { chatParser, messageParser };
