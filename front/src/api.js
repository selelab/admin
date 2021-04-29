import Axios from 'axios'

const api = Axios.create({
  baseURL: "/api/admin",
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
})

export default api;
