import Vue from 'vue'
import Axios from 'axios'

var api = Axios.create({
  // axiosインスタンスの作成
  baseURL: 'http://localhost/kusatsu',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
})

api.interceptors.request.use((config) => {
  if (Vue.$cookies.get('jwt')) {
    config.headers.Authorization = `jwt ${Vue.$cookies.get('jwt')}`
    return config
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

export default api;
