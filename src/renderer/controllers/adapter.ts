/* eslint-disable max-classes-per-file */
import { Conversation, Message } from 'renderer/entity';
import { OConveration, OMessage } from 'renderer/shared/lib/network/type';

interface IParser<E, R> {
  fromEntity(v: E): R;
  toEntity(v: R): E;
}

class ChatParser implements IParser<Conversation, OConveration> {
  fromEntity(v: Conversation): OConveration {
    throw new Error('Method not implemented.');
  }

  toEntity(v: OConveration): Conversation {
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
