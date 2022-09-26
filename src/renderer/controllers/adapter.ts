import { Conversation } from 'renderer/entity';
import { OConveration } from 'renderer/shared/lib/network/type';

interface IParser<E, R> {
  fromEntity(v: E): R;
  toEntity(v: R): E;
}

export default class ChatParser implements IParser<Conversation, OConveration> {
  fromEntity(v: Conversation): OConveration {
    throw new Error('Method not implemented.');
  }

  toEntity(v: OConveration): Conversation {
    throw new Error('Method not implemented.');
  }
}
