import axios from 'axios';

import localhostConfig from '~/_config/host';

const { WEBHOST, PORT } = localhostConfig;

let baseURL = `https://${WEBHOST}`;

if (__DEV__) {
  baseURL = `http://${WEBHOST}:${PORT}`;
}

console.log('baseURL:', baseURL);

const api = axios.create({
  baseURL,
});

export default api;
