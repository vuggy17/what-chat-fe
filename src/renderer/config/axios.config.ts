import { BASEURL } from 'renderer/shared/constants';
import axios from 'axios';

axios.defaults.baseURL = BASEURL;
axios.defaults.withCredentials = true;
