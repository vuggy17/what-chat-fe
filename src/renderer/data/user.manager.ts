import User from 'renderer/domain/user.entity';

class UserManager {
  private _users: User[];

  constructor(users: User[] = []) {
    this._users = users;
  }

  public get users(): User[] {
    return this._users;
  }

  public set users(v: User[]) {
    this._users = v;
  }

  public getById(id: Id): User | undefined {
    return this._users.find((user) => user.id === id);
  }
}
const userManager = new UserManager();
export default userManager;
