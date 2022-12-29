// UI
const PRIMARY_COLOR = 'blue';
const SECONDARY = 'white';

// ROUTES
const REGISTER = 'register';
const LOGIN = 'login';
const APP = 'app';
const C_CONVERSATION = `conversations`;
const C_FRIEND = `${APP}/friend`;
const C_PROFILE = `${APP}/profile`;

// DATA
const MSG_PAGE_SIZE = 30;
const CONV_PAGE_SIZE = 20;

// NETWORK
const BASEURL =
  process.env.REACT_APP_BASE_URL ||
  'https://what-chat-be-production.up.railway.app';
const REQUEST_TIMEOUT = 5000;
const HTTP_ERROR = {
  401: 'Wrong username or password',
  403: 'User existed',
  404: 'Not found',
  500: 'Service unavailable',
};

export {
  PRIMARY_COLOR,
  SECONDARY,
  REGISTER,
  LOGIN,
  APP,
  C_CONVERSATION,
  C_FRIEND,
  C_PROFILE,
  MSG_PAGE_SIZE,
  CONV_PAGE_SIZE,
  BASEURL,
  REQUEST_TIMEOUT,
  HTTP_ERROR,
};
