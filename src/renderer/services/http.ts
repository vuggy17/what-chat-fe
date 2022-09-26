import axios from 'axios';

class HttpClient {
  constructor() {}

  getConversation(userId: Id, chatId: Id) {
    return axios.get(`http://localhost:3000/conversations/${chatId}`);
  }

  getConversations(userId: Id, { limit = 10, offset = 0 }) {
    return axios.get('http://localhost:3000/conversations');
  }

  getChatMessages(chatId: Id, { limit = 10, offset = 0 }) {
    return axios.get(`http://localhost:3000/conversations/${chatId}/messages`);
  }

  getUserData(userId: Id) {
    return axios.get(`http://localhost:3000/users/${userId}`);
  }
}
