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
    id: faker.lorem.paragraph(),
    status: 'sent',
    type: 'text',
    path: faker.image.imageUrl(),
    size: Math.random() * 200,
    uploaded: true,
    name: faker.name.firstName(),
    chatId: faker.animal.fish(),
    senderId: faker.helpers.arrayElement(['1', '2']),
  };
}

export const messages: Message[] = Array.from(
  {
    length: MSG_PAGE_SIZE,
  },
  genMockMsg
);
