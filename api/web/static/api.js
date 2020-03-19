var api = axios.create({
  // axiosインスタンスの作成
  baseURL: '/kusatsu',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
})

api.interceptors.request.use((config) => {
  if (Cookies.get('jwt')) {
    config.headers.Authorization = `jwt ${Cookies.get('jwt')}`
    return config
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

export default api;
