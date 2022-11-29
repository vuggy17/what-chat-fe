/* eslint-disable no-plusplus */
import axios from 'axios';
import { FileMessage, Message } from 'renderer/domain';
import HttpClient from 'renderer/services/http';
import AbstractHandler from './definition';

export default class SendMessageHttp extends AbstractHandler {
  public async handle(
    request: WithRequired<FileMessage, 'fileList'>
  ): Promise<any> {
    // request.

    const credResponse = await this.httpClient.get('/upload');
    const credential = credResponse.data;

    const url = `https://api.cloudinary.com/v1_1/${credential.cloudName}/auto/upload`;

    const files = request.fileList;
    const formData = new FormData();
    // throw new Error('DSda');

    // upload multiple files example
    // Append parameters to the form data. The parameters that are signed using
    // the signing function (signuploadform) need to match these.
    const fileUploads: Promise<any>[] = [];
    const axiosInstance = axios.create({
      withCredentials: false,
    });
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append('file', file);
      formData.append('api_key', credential.apiKey);
      formData.append('timestamp', credential.timestamp);
      formData.append('signature', credential.signature);
      formData.append('eager', 'c_pad,h_300,w_400|c_crop,h_200,w_260');
      formData.append('folder', 'image_upload');

      fileUploads.push(axiosInstance.post(url, formData));
      // fetch(url, {
      //   method: 'POST',
      //   body: formData,
      // })
      //   .then((response) => {
      //     return response.text();
      //   })
      //   .then((data) => {
      //     console.log(JSON.parse(data));
      //     const str = JSON.stringify(JSON.parse(data), null, 4);
      //     document.getElementById('formdata').innerHTML += str;
      //   });
    }

    // formData.append('file', request.fileList);
    // formData.append('api_key', credential.apiKey);
    // formData.append('timestamp', credential.timestamp);
    // formData.append('signature', credential.signature);
    // formData.append('eager', 'c_pad,h_300,w_400|c_crop,h_200,w_260');
    // formData.append('folder', 'image_upload');
    try {
      // const response = await axiosInstance.post(url, formData);
      const responses = await Promise.all(fileUploads);
      const attachmentLinks = responses.map((res) => res.data.secure_url);
      const payload = { ...request, attachments: attachmentLinks };
      console.log('HANDLER: HTTP, completed with payload', payload);
      return super.handle(payload);
    } catch (error: any) {
      console.log('error', error);
      throw new Error(error.message);
    }
  }

  constructor(private httpClient = HttpClient) {
    super();
  }
}
