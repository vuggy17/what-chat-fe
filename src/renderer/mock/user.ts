import User from 'renderer/domain/user.entity';
import { faker } from '@faker-js/faker';

// eslint-disable-next-line import/prefer-default-export
export function genMockUser(): User {
  return {
    id: faker.helpers.arrayElement(['1', '2', '3']),
    name: faker.name.fullName(),
    avatar: faker.image.avatar(),
    userName: faker.internet.userName(),
  };
}

export const mockUsers: User[] = Array.from(
  {
    length: 10,
  },
  genMockUser
);
