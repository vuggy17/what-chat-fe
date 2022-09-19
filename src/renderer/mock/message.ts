/* eslint-disable import/prefer-default-export */
import { faker } from '@faker-js/faker';
import { Message } from 'renderer/entity';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';

export function genMockMsg(): Message {
  return {
    content: faker.lorem.paragraph(),
    createdAt: new Date(),
    fromMe: Math.floor(Math.random() * 10) + 1 > 5,
    globalId: faker.animal.fish(),
    id: faker.animal.fish(),
    status: 'sent',
    type: 'text',
  };
}

export const messages: Message[] = Array.from(
  {
    length: MSG_PAGE_SIZE,
  },
  genMockMsg
);
