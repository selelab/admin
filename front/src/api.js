import Axios from 'axios'

import { store } from './store'

var api = Axios.create({
  // axiosインスタンスの作成
  baseURL: location.protocol + '//' + location.hostname + ':' + 80 + '/kusatsu',
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
