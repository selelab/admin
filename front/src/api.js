import Axios from 'axios'

import { store } from './store'

var api = Axios.create({
  baseURL: 'https://api.selelab.com/api/admin',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
})

export const setTokenToHeader = (token) => {
  api.defaults.headers.common['Authorization'] = `jwt ${token}`;
};

store.subscribe((mutation, state) => {
  if (mutation.type === 'setJwtToken') {
    setTokenToHeader(state.jwtToken);
  }
});

export default api;
