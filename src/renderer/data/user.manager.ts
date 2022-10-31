import IUser from 'renderer/domain/user.entity';

class UserManager {
  private _users: IUser[];

  constructor(users: IUser[] = []) {
    this._users = users;
  }

  public get users(): IUser[] {
    return this._users;
  }

  public set users(v: IUser[]) {
    this._users = v;
  }

  public getById(id: Id): IUser | undefined {
    return this._users.find((user) => user.id === id);
  }
}
const userManager = new UserManager();
export default userManager;
