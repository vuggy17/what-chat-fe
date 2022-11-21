import { Chat } from 'renderer/domain';
import { faker } from '@faker-js/faker';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';

// eslint-disable-next-line import/prefer-default-export
export function genMockChat(): Chat {
  return {
    id: faker.datatype.uuid(),
    typing: Math.random() * 10 > 5,
    name: faker.name.fullName(),
    lastMessage: faker.company.bs(),
    lastUpdate: faker.date.past(),
    preview: faker.lorem.paragraph(),
    status: undefined,
    muted: Math.random() * 10 > 5,
    participants: [faker.random.word()],
    avatar: faker.image.avatar(),
  };
}

export const chat: Chat[] = Array.from(
  {
    length: CONV_PAGE_SIZE,
  },
  () => genMockChat()
);
