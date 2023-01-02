import User from 'renderer/domain/user.entity';
import { Message } from 'renderer/domain';
import SocketClient from 'renderer/services/socket';
import { ISocketClient } from 'renderer/services/type';
import HttpClient from 'renderer/services/http';
import axios from 'axios';
import { CreateGroupPayload, Group } from 'renderer/domain/type';
import AbstractHandler from './definition';

export default class CreateGroup extends AbstractHandler<
  CreateGroupPayload,
  User
> {
  public async handle(data: CreateGroupPayload) {
    const avatar = await this.uploadGroupAvatar(data.avatar);
    console.log('HANDLER: ', 'socket handler');
    const payload: Group = { ...data, avatar };
    return this.socketInstance.createGroup(payload);
  }

  constructor(
    private socketInstance: ISocketClient = SocketClient,
    private readonly httpClient = HttpClient
  ) {
    super();
  }

  async uploadGroupAvatar(avatar: File) {
    const credResponse = await this.httpClient.get('/upload');
    const credential = credResponse.data;

    const url = `https://api.cloudinary.com/v1_1/${credential.cloudName}/auto/upload`;

    const formData = new FormData();

    const axiosInstance = axios.create({
      withCredentials: false,
    });

    formData.append('file', avatar);
    formData.append('api_key', credential.apiKey);
    formData.append('timestamp', credential.timestamp);
    formData.append('signature', credential.signature);
    formData.append('eager', 'c_pad,h_300,w_400|c_crop,h_200,w_260');
    formData.append('folder', 'image_upload');

    try {
      const response = await axiosInstance.post(url, formData);
      const attachmentLink = response.data.secure_url;

      console.log('HANDLER: HTTP, completed with payload', attachmentLink);

      return attachmentLink;
    } catch (error: any) {
      console.log('error', error);
      throw new Error(error.message);
    }
  }
}
