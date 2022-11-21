export default interface IDataSource {
  get<T>(meta: any, config?: any): Promise<any>;
  save<T>(meta: any, config?: any): Promise<any>;
  update<T>(meta: any, config?: any): Promise<any>;
  delete<T>(meta: any, config?: any): Promise<any>;
  handleError(error: any): void;
}
