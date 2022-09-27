// UI
const PRIMARY_COLOR = 'blue';
const SECONDARY = 'white';

// ROUTES
const REGISTER = 'register';
const LOGIN = 'login';
const CHAT = 'chat';
const C_CONVERSATION = `${CHAT}/conversations`;
const C_FRIEND = `${CHAT}/friend`;
const C_PROFILE = `${CHAT}/profile`;

// DATA
const MSG_PAGE_SIZE = 30;
const CONV_PAGE_SIZE = 10;

// NETWORK
const BASEURL = 'http://localhost:3003/';
const REQUEST_TIMEOUT = 5000;
const HTTP_ERROR = {
  401: 'Wrong username or password',
  403: 'User existed',
  404: 'Not found',
  500: 'Service unavailable',
};

// EVENT
enum SocketEvent {
  hasNewMessage = 'message_received',
  sendMessage = 'private_message',
} // SOCKET

export {
  PRIMARY_COLOR,
  SECONDARY,
  REGISTER,
  LOGIN,
  CHAT,
  C_CONVERSATION,
  C_FRIEND,
  C_PROFILE,
  MSG_PAGE_SIZE,
  CONV_PAGE_SIZE,
  BASEURL,
  REQUEST_TIMEOUT,
  SocketEvent,
  HTTP_ERROR,
};
