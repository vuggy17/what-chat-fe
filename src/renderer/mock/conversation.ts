import { Conversation } from 'renderer/entity';
import { faker } from '@faker-js/faker';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';

// eslint-disable-next-line import/prefer-default-export
export function genMockChat(): Conversation {
  return {
    id: faker.unique(faker.phone.number),
    name: faker.name.fullName(),
    isGroup: true,
    lastMessage: faker.company.bs(),
    lastUpdate: new Date(),
    online: 1,
    preview: faker.company.bs(),
    unreadCount: 0,
    status: 'sending',
    participants: [faker.random.word()],
  };
}

export const conversation: Conversation[] = Array.from(
  {
    length: CONV_PAGE_SIZE,
  },
  () => genMockChat()
);
