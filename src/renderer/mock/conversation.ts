import { Conversation } from 'renderer/entity';
import { faker } from '@faker-js/faker';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';

// eslint-disable-next-line import/prefer-default-export
export function genMockChat(): Conversation {
  return {
    id: faker.unique(faker.phone.number),
    typing: Math.random() * 10 > 5,
    name: faker.name.fullName(),
    isGroup: true,
    lastMessage: faker.company.bs(),
    lastUpdate: new Date(),
    online: 1,
    preview: faker.company.bs(),
    unreadCount: 0,
    status: 'sending',
    muted: Math.random() * 10 > 5,
    pinned: Math.random() * 10 > 7,
    participants: [faker.random.word()],
  };
}

const aa: Conversation[] = Array.from(
  {
    length: CONV_PAGE_SIZE,
  },
  () => genMockChat()
);

export const conversation = [
  {
    id: '2',
    typing: Math.random() * 10 > 5,
    name: faker.name.fullName(),
    isGroup: true,
    lastMessage: faker.company.bs(),
    lastUpdate: new Date(),
    online: 1,
    preview: faker.company.bs(),
    unreadCount: 0,
    status: 'sending',
    participants: [faker.random.word()],
    muted: Math.random() * 10 > 5,
    pinned: Math.random() * 10 > 7,
  } as Conversation,
  ...aa,
];
